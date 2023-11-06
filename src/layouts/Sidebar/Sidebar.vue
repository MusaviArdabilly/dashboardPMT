<template>
  <v-navigation-drawer
    permanent
    expand-on-hover
    app
    v-if="globalFeature.sidebar"
  >
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img
            class="pa-2"
            sizes="10"
            src="../../assets/image/kominfo(1).png"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title style="color: #134889">
            KOMINFO
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>
            {{ $t("general.menu.landing_page") }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list nav v-for="(item, groupIndex) in sidebarRole" dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold text-h7">
            {{ item.groupTitle }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-for="(list, listIndex) in item.list">
        <v-list-item
          :to="list.link"
          :class="{ active: isActive(list.link) }"
          @click="setActive(list.link)"
          v-if="list.link"
        >
          <v-list-item-icon>
            <v-icon>{{ list.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ list.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group v-if="list.subitems_1" :prepend-icon="list.icon">
          <template v-slot:activator>
            <v-list-content>
              <v-list-item-title v-text="list.label"></v-list-item-title>
            </v-list-content>
          </template>
          <template v-for="(sublist1, sublist1Index) in list.subitems_1">
            <v-list-item class="ml-15" :to="sublist1.link" v-if="sublist1.link">
              <v-list-content>
                <v-list-item-title v-text="sublist1.label"></v-list-item-title>
              </v-list-content>
            </v-list-item>
            <v-list-group
              v-if="sublist1.subitems_2"
              :prepend-icon="sublist1.icon"
              no-action
              sub-group
            >
              <template v-slot:activator>
                <v-list-content>
                  <v-list-item-title
                    v-text="sublist1.label"
                  ></v-list-item-title>
                </v-list-content>
              </template>
              <v-list-item
                :to="sublist2.link"
                v-for="(sublist2, sublist2Index) in sublist1.subitems_2"
              >
                <v-list-content>
                  <v-list-item-title
                    v-text="sublist2.label"
                  ></v-list-item-title>
                </v-list-content>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script src="./Sidebar.js"></script>
