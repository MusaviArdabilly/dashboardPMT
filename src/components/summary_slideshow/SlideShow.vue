<template>
  <div>
    <v-card flat tile>
      <v-window :value="on_boarding" reverse>
        <v-window-item v-for="data in items" :key="`card-${data.id}`">
          <component :is="data.component" :height="data.height" />
        </v-window-item>
      </v-window>

      <v-card-actions class="justify-space-between">
        <v-btn text @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <!-- <v-item-group :value="on_boarding" class="text-center" mandatory>
          <v-item
            v-for="data in items"
            :key="`btn-${data.id}`"
            v-slot="{ active, toggle }"
          >
            <v-btn :input-value="active" icon @click="toggle">
              <v-icon>mdi-record</v-icon>
            </v-btn>
          </v-item>
        </v-item-group> -->
        <v-btn text @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import Maps from "../../../components/dashboard/VueLayersMaps.vue";
import Coverage from "../../pages/QoS/components/Summary/Coverage.vue";
import Public from "../../pages/Sigmon/Summary/Sigmon.vue";
import Ticketing from "../../pages/SummaryTicketing/Ticketing.vue";
import NodeAlarm from "../../pages/SummaryAlarmSeverity/NodeAlarm.vue";
import AlarmStatus from "../../pages/SummaryAlarmSeverity/components/AlarmStatus.vue";
import AlarmCategory from "../../../components/SummaryDashboard/AlarmCategory.vue";
import {
  NEXT_ITEM,
  PREV_ITEM,
} from "../../../store/modules/executive_navigation.module";
// import { mapGetters} from 'vuex';

export default {
  name: "Slider",
  data() {
    return {
      items: [
        {
          id: 1,
          component: Maps,
          height: "90vh",
        },
        {
          id: 2,
          component: Coverage,
        },
        {
          id: 3,
          component: Public,
        },
        {
          id: 4,
          component: Ticketing,
        },
        {
          id: 5,
          component: NodeAlarm,
        },
        {
          id: 6,
          component: AlarmStatus,
        },
        {
          id: 7,
          component: AlarmCategory,
        },
      ],
      timer: null,
      currentIndex: 0,
      active_indctr: 0,
      length: 3,
      onboarding: 0,
    };
  },

  methods: {
    next() {
      this.$store.dispatch(NEXT_ITEM, this.items.length);
    },
    prev() {
      console.log(this.on_boarding);
      this.$store.dispatch(PREV_ITEM, this.items.length);
    },
  },

  computed: {
    on_boarding() {
      return this.$store.getters.currentOnBoarding;
    },
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.9s ease;
  overflow: hidden;
  visibility: visible;
  position: absolute;
  width: 100%;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  visibility: hidden;
  width: 100%;
  opacity: 0;
}

img {
  height: 800px;
  width: 100%;
}

.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 100%;
  width: auto;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.7s ease;
  border-radius: 0 4px 4px 0;
  text-decoration: none;
  user-select: none;
}

.next {
  right: 0;
}

.prev {
  left: 0;
}

.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.indicator-dot {
  text-align: center;
  display: inline-block;
}

.dot {
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active {
  background-color: #717171;
}
</style>
