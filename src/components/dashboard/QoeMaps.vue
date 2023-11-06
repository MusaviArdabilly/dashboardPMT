<template>
  <div>
    <div ref="map-root" :id="id" :style="`width: 100%; height:${height};`">
      <!-- <div id="info"></div> -->
    </div>

    <div
      v-for="(marker, index) in place"
      :key="index"
      :id="`marker-${index}`"
      :class="`marker`"
      :style="`background-image: url(${marker.url})`"
      @click="handleAlarmDetail(marker)"
    ></div>

    <!-- <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div> -->

    <!-- <v-card id="popup" height="200" width="200" color="red"> Hi </v-card> -->

    <!-- <button id="myaudio" @click="playSound" ref="playAudio">Play Sound</button> -->
  </div>
</template>

<script>
import "ol/ol.css";
import { GET_OPSEL } from "../../store/modules/opsel.module";
import { SET_INFO_DRAWER, SET_INFO } from "../../store/modules/maps.module";

import JwtServices from "../../services/jwt.services";
import { Icon, Style } from "ol/style";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import Geocoder from "ol-geocoder";
import Popup from "ol-popup";

import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";

import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";

import View from "ol/View";
import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";

import { transform } from "ol/proj";
import { FullScreen, defaults as defaultControls } from "ol/control";
// import { toLonLat } from "ol/proj";
// import { toStringHDMS } from "ol/coordinate";

// import { SET_INFO_DRAWER, SET_INFO } from "../../store/modules/maps.module";

var data = {
  soundurl: "http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3",
};

export default {
  props: ["height", "id"],

  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
    data: data,
    sound: true,
    map: null,
    image_index: 1,
    markers: [
      {
        id: 1,
        name: "Parumpanai",
        position: [120.996, -2.465343],
      },
      {
        id: 2,
        name: "Manis Mata",
        position: [110.996, -2.465343],
      },
    ],
    wms_source: null,
    wms_layer: null,
    layers: null,
    view: null,
    layers_by_name: [],
    wmts_layer: null,
    logo: null,
    iconFeatures: [],
    iconStyle: [],
    vectorLayer: [],
    place: [],
    popup: null,
  }),

  watch: {
    activeLayers() {
      let toggled_layer = this.$store.getters.getToggledLayer;
      // Check if layer already exist
      if (this.activeLayers.includes(toggled_layer)) {
        this.addLayers(toggled_layer);
      } else {
        this.removeLayers(toggled_layer);
      }
    },
  },

  mounted() {
    this.initializeMap();
    this.getOperatorCellular();
    this.addIcon();
  },

  created() {},

  methods: {
    getOperatorCellular() {
      this.$store.dispatch(GET_OPSEL);
    },

    playSound() {
      var audio = new Audio(this.data.soundurl);
      audio.play();
    },

    initializeMap() {
      this.view = new View({
        center: transform([117.996, -2.465343], "EPSG:4326", "EPSG:900913"),
        zoom: 6,
        // minZoom: 20,
      });

      this.map = new Map({
        controls: defaultControls().extend([new FullScreen()]),
        // the map will be created using the 'map-root' ref
        target: this.$refs["map-root"],
        layers: [
          new TileLayer({
            source: new OSM(), // tiles are served by OpenStreetMap
          }),
        ],
        // overlays: [overlay],
        view: this.view,
      });

      console.log(this.map);

      // popup
      var popup = new Popup();
      this.map.addOverlay(popup);

      //Instantiate with some options and add the Control
      var geocoder = new Geocoder("nominatim", {
        provider: "osm",
        lang: "en",
        placeholder: "Search for ...",
        limit: 5,
        debug: false,
        autoComplete: true,
        keepOpen: false,
        countrycodes: "id",
        preventDefault: false,
      });
      this.map.addControl(geocoder);

      var geocoderSource = geocoder.getSource();

      geocoder.on("addresschosen", function (evt) {
        console.info(evt);
        geocoderSource.clear();
        geocoderSource.addFeature(evt.feature);
        window.setTimeout(function () {
          popup.show(evt.coordinate, evt.address.formatted);
        }, 1000);
      });
    },

    addIcon() {
      const data = {
        limit: -1,
        page: 1,
        sort: "desc",
        start_date: "",
        end_date: "",
        cell_operator_id: 0,
        status: "open",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        sub_district_id: 0,
        search: "",
      };

      // let place = [];
      fetch(process.env.VUE_APP_API_URL + `api/v1/id/qoe/alarm`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          for (let data of result.data.data) {
            this.place.push({
              url:
                process.env.VUE_APP_API_URL + data.cell_operator.secondary_logo,

              position: [
                parseFloat(data.user_information.full_address.longitude),
                parseFloat(data.user_information.full_address.latitude),
              ],
              data: data,
            });
          }

          this.$nextTick(() => {
            for (let key in this.place) {
              console.log(fromLonLat(this.place[key].position));
              this.map.addOverlay(
                new Overlay({
                  position: fromLonLat(this.place[key].position),
                  positioning: "center-center",
                  element: document.getElementById(`marker-${key}`),
                  stopEvent: false,
                })
              );
            }
          });

          // console.log(this.place);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleAlarmDetail(marker) {
      console.log(marker.data);
      this.$store.commit(SET_INFO_DRAWER, false);
      this.$store.commit(SET_INFO_DRAWER, true);

      this.$store.commit(SET_INFO, marker.data);
    },

    addLayers(layer_name) {
      this.getLegend(layer_name);

      if (this.category != "BTS") {
        this.wms_source = new TileWMS({
          url: "https://geonode.kominfo.go.id/geoserver/geonode/wms?",
          params: {
            LAYERS: layer_name,
            TILED: true,
            transparent: true,
          },
          projection: "EPSG:900913",
          serverType: "geoserver",
          // ratio: 1,
        });

        this.wms_layer = new TileLayer({
          opacity: 0.5,
          source: this.wms_source,
        });

        this.layers_by_name[layer_name] = this.wms_layer;
        this.map.addLayer(this.wms_layer);
      } else {
        for (let item of this.bts) {
          if (item.typename == layer_name) {
            for (let data of this.opsel) {
              if (data.alias.includes(item.group_name.toLowerCase())) {
                this.logo = process.env.VUE_APP_API_URL + data.secondary_logo;
              }
            }
          }
        }

        const iconLayer = new Style({
          image: new Icon({
            src: this.logo,
          }),
        });

        this.vector_layer = new VectorTileLayer({
          source: new VectorTileSource({
            format: new MVT(),
            url: `https://gis-pmt.teamdev.id/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=${layer_name}&STYLE=&TILEMATRIX=EPSG:3857:{z}&TILEMATRIXSET=EPSG:3857&FORMAT=application/vnd.mapbox-vector-tile&TILECOL={x}&TILEROW={y}`,
          }),
          style: iconLayer,
        });
        this.layers_by_name[layer_name] = this.vector_layer;
        this.map.addLayer(this.vector_layer);
      }
    },

    removeLayers(layer_name) {
      this.map.removeLayer(this.layers_by_name[layer_name]);
    },

    getLegend() {},
  },

  computed: {
    activeLayers: {
      get() {
        let layers = this.$store.getters.getActiveLayers;
        let activeLayers = "";
        for (const i of layers) {
          let index = layers.indexOf(i);
          if (layers.length - 1 == index) {
            activeLayers += `${i}`;
          } else {
            activeLayers += `${i},`;
          }
        }
        return activeLayers;
      },
      set(val) {
        return val;
      },
    },

    mapStyle: function () {
      return this.$store.getters.getMapStyle;
    },

    bts: function () {
      return this.$store.getters.getBts;
    },

    category: function () {
      return this.$store.getters.getCategory;
    },

    opsel: function () {
      return this.$store.getters.getOpsel;
    },

    alarm: function () {
      return this.$store.getters.getQoEAlarm;
    },
  },
};
</script>

<style>
/* #marker {
  width: 365px;
  height: 360px;
  background: url("https://articulate-heroes.s3.amazonaws.com/uploads/rte/kgrtehja_DancingBannana.gif")
    no-repeat scroll 0% 0% transparent;
} */

.map:-webkit-full-screen {
  height: 100%;
  margin: 0;
}
.map:-ms-fullscreen {
  height: 100%;
}
.map:fullscreen {
  height: 100%;
}
/* position the rotate control lower than usual */
.map .ol-rotate {
  top: 3em;
}

.marker {
  display: block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: orange;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(255, 0, 0, 0.4);
  animation: pulse 3s infinite;
}

.marker:hover {
  animation: none;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
  }

  70% {
    box-shadow: 0 0 0 50px rgba(255, 0, 0, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}

#mapRounded {
  border: 1px solid white;
  border-radius: 15px !important;
}

#mapRounded div canvas {
  border: 1px solid white;
  border-top-left-radius: 15px !important;
  border-top-right-radius: 15px !important;
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}
#info {
  position: absolute;
  z-index: 10;
  background-color: black;
  border: 1px solid #ccc;
  color: #fff;
  padding: 5px;
  font-size: 18px;
  top: -10em;
  pointer-events: none;
}

.ol-control button {
  background-color: rgba(40, 40, 40, 0.8) !important;
}
.ol-control button:hover {
  background-color: rgba(0, 60, 136, 0.7) !important;
}

.ol-zoom {
  top: auto;
  /* bottom: 1em !important; */
}

.ol-geocoder .gcd-gl-control {
  top: 200px !important;
  bottom: 0px !important;
}

.ol-geocoder ul.gcd-gl-result {
  top: 240px !important;
}

.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>
