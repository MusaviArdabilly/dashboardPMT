<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
  <section
    :class="`lp-pmt ${$vuetify.breakpoint.mdAndDown ? '' : ''}`"
    v-if="user"
  >
    <div class="intro-pmt-header">
      <NavBar v-show="!$vuetify.breakpoint.mdAndDown" />
      <div class="intro-welcome">
        <div
          :class="`${
            $vuetify.breakpoint.mdAndDown
              ? 'kominfo-box'
              : 'kominfo-box ml-15 mt-5'
          }`"
        >
          <div class="d-flex" v-if="$vuetify.breakpoint.mdAndDown">
            <img
              width="20%"
              class="mb-5"
              src="../../../assets/image/kemkoinfo-putih.png"
              alt="logo"
            />
            <v-spacer></v-spacer>
            <v-btn icon @click="drawer = true">
              <v-icon color="#fff">mdi-text</v-icon>
            </v-btn>
          </div>
          <div v-else>
            <img
              width="20%"
              class="mb-5"
              src="../../../assets/image/kemkoinfo-putih.png"
              alt="logo"
            />
          </div>
          <div class="mt-2 font-weight-bold white--text" v-if="user != null">
            {{ $t("landing.header.welcome") }},
            {{ user.first_name }}
          </div>
          <div class="font-weight-bold white--text">
            {{ $t("landing.header.app_name") }}
          </div>
          <v-chip class="mt-2 white--text" color="#134889" v-if="user != null">
            {{ $t("landing.header.version") }}
            {{ setting.value }}</v-chip
          >
        </div>
      </div>
      <!-- v-if="user.role == 'admin' || user.role" -->
      <div class="landing-menu">
        <!-- Menu -->
        <div class="pmt-flex wrap is-row at-center landing-menu-header">
          <v-col
            cols="6"
            md="2"
            lg="2"
            xl="2"
            v-for="(item, index) in landingMenuRole"
          >
            <v-card
              class="pmt-menu-card pmt-flex wrap is-column at-between"
              elevation="2"
              width="100%"
              min-height="15rem"
              :href="item.url"
              v-if="item.url != null"
            >
              <div class="icon">
                <img :src="item.icon" alt="" />
              </div>
              <div class="mt-2">{{ item.name }}</div>
            </v-card>
            <v-card
              @click="actionLandingDialog(item.title)"
              class="pmt-menu-card pmt-flex wrap is-column at-between"
              elevation="2"
              width="100%"
              min-height="15rem"
              v-else
            >
              <div class="icon">
                <img :src="item.icon" alt="" />
              </div>
              <div class="mt-2">{{ item.name }}</div>
            </v-card>
          </v-col>
        </div>
        <!-- Footer -->
        <div
          class="pmt-flex footer-menu-wrap wrap is-row at-center landing-menu-footer"
        >
          <!-- Admin Page | admin  -->
          <v-col cols="12" md="6" lg="6" xl="3" v-for="item in footerMenuRole">
            <v-btn
              color="white"
              light
              block
              v-if="item.ownDialog == true"
              @click="actionFooterDialog(item.dialogName)"
            >
              <v-icon color="#3C7FBE" class="mr-2">{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-btn>
            <v-btn
              color="white"
              light
              block
              v-else
              @click="actionLandingDialog(item.dialogName)"
            >
              <v-icon color="#3C7FBE" class="mr-2">{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-btn>
          </v-col>
        </div>
      </div>
    </div>
    <!-- DIALOG CREATE USER -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <div class="pa-5 font-weight-bold d-flex">
          Create User
          <v-spacer></v-spacer>
          <v-icon
            @click="
              dialog = false;
              $refs.formcreate.resetValidation();
            "
            >mdi-close</v-icon
          >
        </div>
        <v-divider></v-divider>
        <div class="pa-5">
          <v-form ref="formcreate" v-model="valid" lazy-validation>
            <div>Username</div>
            <v-text-field
              v-model="username"
              outlined
              dense
              placeholder="Username"
              :rules="rules"
            ></v-text-field>
            <div>Firstname</div>
            <v-text-field
              v-model="firstname"
              outlined
              dense
              placeholder="Firstname"
              :rules="rules"
            ></v-text-field>
            <div>Lastname</div>
            <v-text-field
              v-model="lastname"
              outlined
              dense
              placeholder="Lastname"
              :rules="rules"
            ></v-text-field>
            <div>Email</div>
            <v-text-field
              v-model="email"
              outlined
              dense
              placeholder="Email"
              :rules="rules"
            ></v-text-field>
            <div>Password</div>
            <v-text-field
              v-model="password"
              outlined
              dense
              placeholder="Password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
              :rules="rules"
            ></v-text-field>
            <div>Department</div>
            <v-select
              v-model="selected_department"
              outlined
              dense
              placeholder="Department"
              :rules="rules"
              :items="department"
              return-object
              item-text="name"
            ></v-select>
            <div>Role</div>
            <v-select
              v-model="selected_role"
              outlined
              dense
              placeholder="Role"
              :rules="rules"
              :items="role"
              item-text="name"
              item-value="name"
            ></v-select>
            <label>Is Viewer</label>
            <v-switch
              class="my-3"
              v-model="is_viewer"
              inset
              :label="is_viewer ? 'Yes' : 'No'"
            >
            </v-switch>
            <template v-if="selected_role == 'network-operator'">
              <div>Network Operator</div>
              <v-select
                v-model="selected_network_operator"
                outlined
                dense
                placeholder="Network Operator"
                :rules="rules"
                :items="network_operator"
                item-text="name"
                item-value="id"
              ></v-select>
            </template>
            <v-btn
              @click="createUser"
              elevation="0"
              class="text-capitalize white--text"
              width="100%"
              color="#134889"
              :disabled="!valid"
              >Submit</v-btn
            >
          </v-form>
        </div>
      </v-card>
      <v-alert
        :value="alert"
        dense
        type="success"
        transition="scale-transition"
      ></v-alert>
    </v-dialog>
    <div class="intro-pmt-footer">
      <v-divider class="nav-footer"></v-divider>
      <div
        :class="[`${$vuetify.breakpoint.mdAndDown ? 'mx-5' : 'cpr-pmt'}`]"
        :style="[`${$vuetify.breakpoint.mdAndDown ? 'font-size: 10px' : ''}`]"
      >
        Copyright &copy; 2021
        <b> <u> Kementerian Komunikasi Dan Informatika.</u></b>
      </div>
    </div>
    <!-- mobile navigation -->
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="pmt_url + user.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item>
          <v-btn width="100%" @click="logout">Logout</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- dowload dialog -->
    <v-dialog
      :width="`${$vuetify.breakpoint.mdAndDown ? '80%' : '30%'}`"
      v-model="showDownload"
    >
      <v-card class="pa-5" width="100%">
        <div class="pmt-flex wrap is-column pa-5">
          <v-col cols="12" xl="12" v-for="item in link">
            <template v-if="item.image != ''">
              <a :href="item.link" target="_blank" class="abutton">
                <img
                  width="100%"
                  :src="item.image"
                  :alt="item.title"
                  :title="item.title"
                />
              </a>
            </template>
            <template v-else>
              <v-btn
                :href="item.link"
                target="_blank"
                width="100%"
                elevation="0"
                color="#169CD6"
                class="white--text pa-2 mb-3"
              >
                {{ item.title }}
              </v-btn>
            </template>
          </v-col>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog width="45%" v-model="navigationModal">
      <v-card class="text-center">
        <div>
          <div class="pa-5 font-weight-bold" style="color: #645959">
            {{ modal_title }}
          </div>
          <v-divider></v-divider>
          <div class="pa-5">
            <div class="pmt-flex wrap is-column">
              <v-col
                class="pa-0"
                cols="12"
                v-for="item in selected_modal"
                :key="item.index"
              >
                <v-btn
                  block
                  class="ma-3 text-capitalize white--text"
                  rounded
                  color="#134889"
                  @click="
                    item.name == 'GIS Infra Dashboard'
                      ? executiveNavigation(item.id, item.name)
                      : executiveNavigation(item.id, item.link)
                  "
                >
                  {{ item.name }}
                </v-btn>
              </v-col>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-overlay :z-index="999" :value="loading_overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </section>
</template>

<script src="./LandingPage.js"></script>

<style lang="scss" src="./LandingPage.scss" scoped></style>
