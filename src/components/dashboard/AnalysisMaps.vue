<template>
  <div>
    <div ref="map-root" :id="id" :style="`width: 100%; height:${height};`">
      <!-- <div id="info"></div> -->
    </div>
  </div>
</template>

<script>
// import "ol/ol.css";

// import JwtServices from "../../services/jwt.services";

import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";

import OSM from "ol/source/OSM";
// import TileWMS from "ol/source/TileWMS";

import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";

// import VectorTileLayer from "ol/layer/VectorTile";
// import VectorTileSource from "ol/source/VectorTile";

import { fromLonLat, transform } from "ol/proj";
import { FullScreen, defaults as defaultControls } from "ol/control";

export default {
  props: ["height", "id", "province", "city"],

  data: () => ({
    pmt_url: process.env.VUE_APP_API_URL,
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
    layers: null,
    view: null,
    vector_layer: null,
  }),

  watch: {
    analysis_province(newValue, oldValue) {
      console.log(newValue, oldValue);
      if (this.activeParam.district == "") {
        if (this.activeParam.city == "") {
          this.provinceLayer(newValue, oldValue);
        }
      }
    },

    analysis_city(newValue, oldValue) {
      console.log(newValue, oldValue);
      if (this.activeParam.district == "") {
        this.cityLayer(newValue, oldValue);
      }
    },

    // analysis_district(value) {

    // }

    // activeFilter(newValue) {
    //   console.log(newValue);
    // },
  },

  mounted() {
    this.initializeMap();
  },

  created() {},

  methods: {
    initializeMap() {
      this.view = new View({
        center: transform([117.996, -2.465343], "EPSG:4326", "EPSG:900913"),
        zoom: 6,
        // minZoom: 20,
      });

      // const vector_layer = new VectorLayer({
      //   source: new VectorSource({
      //     format: new GeoJSON(),
      //     url: `https://infragis.kominfo.go.id/geoserver/geonode/ows?CQL_Filter=wadmpr%20=%20%27Jawa%20Barat%27&service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3A_83285_prov&maxFeatures=500&outputFormat=application%2Fjson`,
      //   }),
      // });

      this.map = new Map({
        controls: defaultControls().extend([new FullScreen()]),
        // the map will be created using the 'map-root' ref
        target: this.$refs["map-root"],
        layers: [
          new TileLayer({
            source: new OSM(), // tiles are served by OpenStreetMap
          }),
          // vector_layer,
        ],
        // overlays: [overlay],
        view: this.view,
      });
    },

    provinceLayer(newValue, oldValue) {
      console.log(newValue, oldValue);
      if (oldValue != this.analysis_province) {
        this.map.removeLayer(this.vector_layer);
      }

      this.vector_layer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: `https://infragis.kominfo.go.id/geoserver/geonode/ows?CQL_Filter=wadmpr%20=%20%27${this.analysis_province}%27&service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3A_83285_prov&maxFeatures=500&outputFormat=application%2Fjson`,
        }),
      });

      this.layer_name = this.vector_layer;
      this.map.addLayer(this.vector_layer);

      for (let data of this.province) {
        if (data.name == newValue.toUpperCase()) {
          this.view.animate({
            center: fromLonLat([data.longitude, data.latitude]),
            duration: 2000,
            zoom: 8,
          });
        }
      }
    },

    cityLayer(newValue, oldValue) {
      console.log(newValue, oldValue);
      if (oldValue != this.analysis_city) {
        this.map.removeLayer(this.vector_layer);
      }

      this.vector_layer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: `https://infragis.kominfo.go.id/geoserver/geonode/wms?service=WMS&version=1.1.0&request=GetMap&layers=geonode%3Aa__83285_KAB&bbox=94.97201709200002%2C-11.007615377000066%2C141.02004178900006%2C6.076930029000044&width=768&height=330&srs=EPSG%3A4326&styles=&format=geojson&CQL_Filter=wadmkk=%27${this.analysis_city}%27`,
        }),
      });

      this.layer_name = this.vector_layer;
      this.map.addLayer(this.vector_layer);

      for (let data of this.city) {
        if (data.alt_name.includes(newValue.toUpperCase())) {
          console.log("MASUK");
          this.view.animate({
            center: fromLonLat([data.longitude, data.latitude]),
            duration: 2000,
            zoom: 8,
          });
        }
      }
    },
  },

  computed: {
    activeParam() {
      return this.$store.getters.active_param;
    },
    activeFilter() {
      return this.$store.getters.active_filter;
    },
    analysis_province() {
      return this.$store.getters.analysis_province;
    },
    analysis_city() {
      return this.$store.getters.analysis_city;
    },
    analysis_district() {
      return this.$store.getters.analysis_district;
    },

    resetFilter() {
      return this.$store.getters.reset;
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

.ol-zoom {
  top: auto;
  bottom: 1em !important;
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
