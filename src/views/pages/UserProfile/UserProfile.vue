<template>
  <div class="user-settings">
    <div class="d-flex mt-5">
      <div class="font-weight-bold" id="title">
        {{ $t("ui.text_piece.setting") }}
      </div>
      <v-spacer></v-spacer>
    </div>
    <v-row class="mt-3">
      <v-col lg="4">
        <v-card elevation="4" width="100%" class="pt-2 pr-2 pb-2">
          <div
            v-for="menu in settingMenu"
            :key="menu.id"
            :class="[
              `list-settings-${menu.id} `,
              { active: active_el == menu.id },
            ]"
            @click="selectedMenu(menu.id)"
          >
            <v-icon class="mr-2">{{ menu.icon }}</v-icon>
            {{ menu.name }}
          </div>
        </v-card>
      </v-col>
      <v-col lg="8">
        <v-card elevation="4" class="pa-5">
          <component :is="component" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script src="./UserProfile.js"></script>

<style scoped>
/* @import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css"; */

.user-settings {
  height: 100vh;
}

.v-sheet.v-card {
  border-radius: 20px;
}

#title {
  font-size: 1.5rem;
}

.active {
  background-color: #1008ce;
  color: #ffffff !important;
  box-shadow: rgba(25, 36, 187, 0.5) 0px 5px 10px;
}
.list-settings-1,
.list-settings-2,
.list-settings-3 {
  padding: 10px;
  margin-top: 20px;
  cursor: pointer;
}

.list-settings-1 {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 20px;
}

.list-settings-2 {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
}

.list-settings-3 {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
}

.list-settings-3 {
  margin-bottom: 20px;
}

.list-settings-1.active .v-icon.v-icon,
.list-settings-2.active .v-icon.v-icon,
.list-settings-3.active .v-icon.v-icon {
  color: #ffffff !important;
}

.list-settings-1 .v-icon.v-icon,
.list-settings-2 .v-icon.v-icon,
.list-settings-3 .v-icon.v-icon {
  color: #645959;
}
</style>
