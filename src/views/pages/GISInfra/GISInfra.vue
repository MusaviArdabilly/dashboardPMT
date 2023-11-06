<template>
  <iframe
    src="https://infragis.kominfo.go.id/"
    width="100%"
    height="100%"
    frameborder="0"
  ></iframe>
</template>

<script>
import JwtService from "../../../services/jwt.services";
export default {
  created() {
    let token = JwtService.getToken();
    if (token == null) {
      this.$router.push("/auth/login");
    }
  },
};
</script>

<style>
</style>