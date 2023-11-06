<template>
  <div class="pmt-auth">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data: () => ({
    model: 0,
    colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
  }),
};
</script>

<style scoped>
.img-login {
  width: 100%;
  height: 100%;
}

.pmt-auth {
  background-image: url("../../../assets/image/auth-bg.png");
  background-size: cover;
  object-fit: cover;
  height: 100%;
}
</style>