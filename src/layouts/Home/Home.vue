<template>
  <v-app>
    <sidebar-nav></sidebar-nav>

    <!-- Main content -->
    <v-main :class="`mb-15 ${!globalFeature.sidebar ? 'no-sidebar' : ''}`">
      <NavBar :elevation="2" />
      <v-container fluid class="pl-15 pr-15 pb-10">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer absolute>
      <div class="pl-15 pr-15 ml-10 mr-15">
        {{ $t("ui.text_piece.copyright") }} &copy; 2021
        <a
          class="black--text font-weight-bold text-decoration-underline"
          href="https://kominfo.go.id"
          >Kementerian Komunikasi Dan Informatika</a
        >
      </div>
    </v-footer>
  </v-app>
</template>

<script src="./Home.js"></script>

<style lang="scss">
/* HIDE SCROLL BAR BUT STILL ABLE TO SCROLL */
/* html {
  overflow: scroll;
} */
/* make scrollbar transparent */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.item-per-page {
  width: 150px;
}

.item-per-page::before {
  content: "Item";
  margin-top: 0.5em;
  margin-right: 1em;
}

main {
  /* padding: 0px 0px 0px 50px !important; */
  padding-left: 3rem !important;
  &.no-sidebar {
    padding-left: 0 !important;
  }
}
</style>
