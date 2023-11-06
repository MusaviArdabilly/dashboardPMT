<template>
  <div class="pmt-flex is-row wrap pl-5 pr-5 pt-2 pb-8">
    <button
      is="v-btn"
      active-class="active-link"
      :class="[
        `text-capitalize text-capitalize pl-6 pr-6`,
        isPage == 'Operator Cellular' ? `white--text` : ``,
      ]"
      rounded
      :outlined="isPage == 'Operator Cellular' ? false : true"
      :to="{ path: link.cellular }"
    >
      {{ $t("general.menu.operator_cellular") }}
    </button>
    <button
      is="v-btn"
      active-class="active-link"
      :class="[
        `text-capitalize text-capitalize pl-6 pr-6 ml-6`,
        isPage == 'Fixed Broadband' ? `white--text` : ``,
      ]"
      rounded
      :outlined="isPage == 'Fixed Broadband' ? false : true"
      :to="{ path: link.fo }"
    >
      {{ $t("general.menu.fixed_broadband") }}
    </button>
  </div>
</template>
<script>
export default {
  props: {
    link: {
      type: Object,
      default: {
        cellular: "/",
        fo: "/",
      },
    },
    isPage: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss">
.active-link {
  box-shadow: unset !important;
  background: #134889 !important;
}
</style>
