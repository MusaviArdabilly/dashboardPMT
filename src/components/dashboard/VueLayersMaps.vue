<template>
  <div>
    <div ref="map-root" :id="id" :style="`width: 100%; height:${height};`">
      <!-- <div id="info"></div> -->
    </div>

    <div
      v-show="showAlarm"
      v-for="(marker, index) in place"
      :key="index"
      :id="`marker-${index}`"
      :class="`marker`"
      @click="handleAlarmDetail(marker)"
    ></div>
    <!-- <v-card id="popup" height="200" width="200" color="red"> Hi </v-card> -->

    <!-- <button id="myaudio" @click="playSound" ref="playAudio">Play Sound</button> -->
  </div>
</template>

<script>
// import "ol/ol.css";
import { Icon, Style } from "ol/style";
import { GET_OPSEL } from "../../store/modules/opsel.module";
import Geocoder from "ol-geocoder";
import Popup from "ol-popup";

import JwtServices from "../../services/jwt.services";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";

// import { GET_INFO_DRAWER } from "../../store/modules/maps.module";
// import ImageWMS from "ol/source/ImageWMS";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
// import Point from "ol/geom/Point";
// import Feature from "ol/Feature";
// import { Icon, Style } from "ol/style";
// import VectorSource from "ol/source/Vector";
// import MapBoxVector from "ol/layer/MapboxVector";

// import GeoJSON from "ol/format/GeoJSON";
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";
// import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import OSM from "ol/source/OSM";
import View from "ol/View";
import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
// import WMTS from "ol/source/WMTS";
// import WMTSTileGrid from "ol/tilegrid/WMTS";
// import { get as getProjection } from "ol/proj";
// import { getTopLeft, getWidth } from "ol/extent";
// // import {
//   Image as ImageLayer,
// Tile as TileLayer,
//   // Vector as VectorLayer,
// } from "ol/layer";
import {
  //   addCoordinateTransforms,
  //   addProjection,
  // transformExtent,
  transform,
} from "ol/proj";

// import Bintan from "../../assets/geojson/2102.json";
// import Natuna from "../../assets/geojson/2103.json";

import {
  SET_INFO_DRAWER,
  SET_INFO,
  SET_ACTIVE_LAYER,
} from "../../store/modules/maps.module";

// const alarmLayer = [Bintan, Natuna];
var data = {
  soundurl: "http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3",
};

export default {
  props: ["height", "id"],

  data: () => ({
    data: data,
    sound: true,
    map: null,
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
    place: [],
  }),

  mounted() {
    this.initializeMap();
    this.getOperatorCellular();
    this.addAlarm();

    setInterval(() => {
      this.addAlarm();
    }, 300000);

    let self = this;

    this.map.on("singleclick", function (evt) {
      const viewResolution = /** @type {number} */ (self.view.getResolution());
      const url = self.wms_source.getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        "EPSG:900913",
        { INFO_FORMAT: "application/json", FEATURE_COUNT: "1000" }
      );
      if (url) {
        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.features.length == 0) {
              return;
            }
            self.$store.commit(SET_INFO_DRAWER, false);
            self.$store.commit(SET_INFO_DRAWER, true);

            self.$store.commit(SET_INFO, data);
          });
      }
    });

    // for (const iterator of this.markers) {
    //   this.map.addOverlay(
    //     new Overlay({
    //       position: fromLonLat(iterator.position),
    //       positioning: "center-center",
    //       element: document.getElementById(`marker-${iterator.id}`),
    //       stopEvent: false,
    //     })
    //   );
    // }
  },

  created() {
    // if (this.sound) {
    //   setTimeout(() => {
    //     this.playSound();
    //   }, 3000);
    //   this.sound = false;
    // }
    // let audioPlay = document.getElementById("myaudio");
    // var audio = new Audio(this.data.soundurl);
    // audioPlay.play();
    // setTimeout(() => {
    //   audioPlay.pause();
    //   audioPlay.load();
    // }, 10);
  },

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

      this.layers = [
        // new MapBoxVector({
        //   styleUrl: this.mapStyle,
        //   accessToken:
        //     "pk.eyJ1IjoiZmF1emFubWFzdWxpbGkiLCJhIjoiY2twZG96a3Q4MGR6czJ2dDZjY3I3cGw0MCJ9.PcAEOYxT6-9wto4U-d5anw",
        // }),

        new TileLayer({
          source: new OSM(),
        }),

        // geojson
        // vectorLayer,
        // vectorLayerBintan,
      ];

      this.map = new Map({
        layers: this.layers,
        target: this.$refs["map-root"],
        view: this.view,
      });

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

    addAlarm() {
      const data = {
        limit: -1,
        page: 1,
        sort: "asc",
        start_date: "",
        end_date: "",
        search: "",
        status: "open",
        province_id: "[]",
        city_id: "[]",
        district_id: "[]",
        sub_district_id: "[]",
        cell_operator_id: 0,
      };

      fetch(process.env.VUE_APP_API_URL + `api/v2/id/alarm`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtServices.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          this.place = [];

          for (let data of result.data.data) {
            this.place.push({
              url:
                process.env.VUE_APP_API_URL + data.cell_operator.secondary_logo,
              position: [parseFloat(data.longitude), parseFloat(data.latitude)],
              data: data,
            });
          }
          console.log(this.place);

          this.$nextTick(() => {
            for (let key in this.place) {
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
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleAlarmDetail(marker) {
      this.$store.commit(SET_INFO_DRAWER, false);
      this.$store.commit(SET_INFO_DRAWER, true);

      this.$store.commit(SET_INFO, marker.data);
    },

    addLayers(layer_name) {
      this.getLegend(layer_name);

      if (this.category != "BTS") {
        this.wms_source = new TileWMS({
          url: "https://infragis.kominfo.go.id/geoserver/geonode/wms?",
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
          // console.log("item.typename", item.group_name, item, layer_name);
          if (item.alternate == layer_name) {
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
            url: `https://infragis.kominfo.go.id/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=${layer_name}&STYLE=&TILEMATRIX=EPSG:3857:{z}&TILEMATRIXSET=EPSG:3857&FORMAT=application/vnd.mapbox-vector-tile&TILECOL={x}&TILEROW={y}`,
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

    removeAllLayers() {
      this.layers_by_name = [];
      this.initializeMap();
    },

    getLegend() {},

    removeLayerAll() {
      this.$store.commit(SET_ACTIVE_LAYER, []);
    },
  },

  computed: {
    activeLayers: {
      get() {
        let layers = this.$store.getters.getActiveLayers;
        console.log(layers);
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

    showAlarm: function () {
      return this.$store.getters.showAlarm;
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
  },

  watch: {
    activeLayers() {
      let toggled_layer = this.$store.getters.getToggledLayer;
      // Check if layer already exist
      if (toggled_layer == "") {
        let ar = this.activeLayers.split(",");
        let duplicateElements = [];
        if (ar.length != 0) {
          const toFindDuplicates = (arry) =>
            arry.filter((item, index) => arry.indexOf(item) !== index);
          duplicateElements = toFindDuplicates(ar);
        }

        if (duplicateElements.length != 0) {
          for (const r of duplicateElements) {
            this.removeLayers(r);
          }
        } else {
          for (const r of ar) {
            this.addLayers(r);
          }
        }
      } else {
        if (this.activeLayers.includes(toggled_layer)) {
          this.addLayers(toggled_layer);
        } else {
          this.removeLayers(toggled_layer);
        }
      }
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

.ol-control button {
  background-color: rgba(40, 40, 40, 0.8) !important;
}
.ol-control button:hover {
  background-color: rgba(0, 60, 136, 0.7) !important;
}

.ol-geocoder .gcd-gl-control {
  width: 15.5em;
  height: 2.5em;
}

.ol-geocoder .gcd-gl-btn {
  top: 0.3em;
  left: 0.3em;
  height: 38px;
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

.ol-zoom {
  top: auto;
  bottom: 1em !important;
}

.ol-geocoder .gcd-gl-input {
  width: 265px;
  height: 42px;
}

.ol-geocoder .gcd-gl-control {
  top: 60px !important;
  left: 105.5em;
  bottom: 0px !important;
  width: 300px;
  height: 50px;
}

.ol-geocoder ul.gcd-gl-result {
  top: 115px !important;
  left: 105.5em;
  width: 300px;
}

.ol-popup {
  position: absolute;
  min-width: 180px;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  bottom: 12px;
  left: -50px;
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
