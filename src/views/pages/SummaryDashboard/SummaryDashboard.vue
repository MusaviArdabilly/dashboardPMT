<template>
  <div class="summary-dashboard">
    <SlideShow />
  </div>
</template>

<script>
import SlideShow from "../../../components/summary_slideshow/SlideShow.vue";
export default {
  components: { SlideShow },
  data: () => ({}),

  methods: {},
};
</script>

<style>
.v-carousel--hide-delimiter-background .v-carousel__controls {
  /* padding: 0px 0px 10px 0px !important; */
  background: green !important;
}
</style>
