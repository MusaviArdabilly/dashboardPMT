<template>
  <section
    :class="`${$vuetify.breakpoint.mdAndDown ? 'lp-pmt-mobile' : 'lp-pmt'}`"
    v-if="user"
  >
    <NavBar v-show="!$vuetify.breakpoint.mdAndDown" />
    <div class="ma-5 d-flex">
      <div
        :class="`${$vuetify.breakpoint.mdAndDown ? '' : 'ml-15 mt-5'}`"
        style="width: 100%"
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
          {{ $t("landing.header.welcome") }}, {{ user.first_name }}
        </div>
        <div class="font-weight-bold white--text">
          {{ $t("landing.header.app_name") }}
        </div>
        <v-chip class="mt-2 white--text" color="#134889" v-if="user != null">
          {{ $t("landing.header.version") }} {{ setting.value }}</v-chip
        >
      </div>
    </div>
    <!-- v-if="user.role == 'admin' || user.role" -->
    <div class="sec-bg">
      <v-row
        :class="`${$vuetify.breakpoint.mdAndDown ? 'pa-5' : 'pmt-crd-nav'}`"
        justify="center"
      >
        <!-- Executive Dashboard | admin, executive, operator -->
        <v-col
          justify="center"
          align="center"
          xl="2"
          lg="2"
          md="12"
          sm="12"
          xs="12"
        >
          <router-link to="/peta"
            ><v-card class="pa-5" elevation="2" width="100%" min-height="15rem">
              <img src="../../../assets/image/analysis-dashboard.svg" alt="" />
              <div class="mt-2">{{ $t("landing.body.map") }}</div>
            </v-card>
          </router-link>
        </v-col>
        <v-col
          v-if="user.role == 'executive'"
          justify="center"
          align="center"
          xl="2"
          lg="2"
          md="12"
          sm="12"
          xs="12"
          class="mx-auto"
        >
          <v-card
            @click="showModalNavigation($t('general.menu.executive_dashboard'))"
            class="pa-5"
            elevation="2"
            width="100%"
            min-height="15rem"
          >
            <img src="../../../assets/image/analysis-dashboard.svg" alt="" />
            <div class="mt-2">{{ $t("landing.body.executive_dashboard") }}</div>
          </v-card>
        </v-col>
        <v-col v-else align="right" xl="2" lg="2" md="3" sm="12" xs="12">
          <v-card
            @click="showModalNavigation($t('general.menu.executive_dashboard'))"
            class="pa-5 card-center"
            elevation="2"
            width="100%"
            min-height="15rem"
          >
            <img src="../../../assets/image/analysis-dashboard.svg" alt="" />
            <div class="mt-2">{{ $t("landing.body.executive_dashboard") }}</div>
          </v-card>
        </v-col>
        <!-- Operator | admin, operator -->
        <v-col
          v-if="user.role != 'executive'"
          justify="center"
          align="center"
          xl="2"
          lg="2"
          md="12"
          sm="12"
          xs="12"
        >
          <v-card
            @click="showModalNavigation($t('general.menu.operator'))"
            class="pa-5"
            elevation="2"
            width="100%"
            min-height="15rem"
          >
            <img src="../../../assets/image/map-dashboard.svg" alt="" />
            <div class="mt-2">{{ $t("landing.body.operator") }}</div>
          </v-card>
        </v-col>
        <!-- Analytic Dashboard | admin, operator -->
        <v-col
          v-if="user.role != 'executive'"
          xl="2"
          lg="2"
          md="12"
          sm="12"
          xs="12"
        >
          <router-link to="/analysis">
            <v-card
              class="pa-5 card-center"
              elevation="2"
              width="100%"
              min-height="15rem"
            >
              <img src="../../../assets/image/executive-dashboard.svg" alt="" />
              <div class="mt-2">
                {{ $t("landing.body.analysis_dashboard") }}
              </div>
            </v-card>
          </router-link>
        </v-col>
        <!-- Ticket Management System | admin, operator -->
        <v-col
          v-if="user.role != 'executive'"
          justify="center"
          align="right"
          xl="2"
          lg="2"
          md="12"
          sm="12"
          xs="12"
        >
          <router-link to="/dashboard/ticketing-management">
            <v-card
              class="pa-5 card-center"
              elevation="2"
              width="100%"
              min-height="15rem"
            >
              <img src="../../../assets/image/ticketing.svg" alt="" />
              <div class="mt-2">
                {{ $t("landing.body.ticket_management_system") }}
              </div>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
      <v-container>
        <v-row class="lp-footer" justify="center">
          <!-- Admin Page | admin  -->
          <v-col
            v-if="user.role == 'admin'"
            xl="3"
            lg="3"
            md="12"
            sm="12"
            xs="12"
            class="lp-footer text-right admin-page"
          >
            <v-btn
              @click="dialog = true"
              :width="`${$vuetify.breakpoint.mdAndDown ? '100%' : '77%'} `"
              color="white"
              light
            >
              <v-icon color="#3C7FBE" class="mr-2"
                >mdi-account-plus-outline</v-icon
              >
              {{ $t("landing.footer.create_user") }}
            </v-btn>

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
          </v-col>
          <v-col
            v-if="user.role == 'admin'"
            @click="showModalNavigation($t('general.menu.admin_settings'))"
            xl="2"
            lg="2"
            md="12"
            sm="12"
            xs="12"
            class="lp-footer text-center admin-page"
          >
            <v-btn width="100%" color="white">
              <v-icon color="#3C7FBE" class="mr-2">mdi-cog</v-icon>

              {{ $t("landing.footer.module") }}
            </v-btn>
          </v-col>
          <v-col
            v-if="user.role == 'executive'"
            xl="6"
            lg="6"
            md="12"
            sm="12"
            xs="12"
            class="lp-footer"
            align="right"
            justify="center"
          >
            <v-btn width="30%" color="white">
              <a
                href="https://drive.google.com/drive/folders/1uPSi3J0FMJLzW4KnQn1cIUanS0AlZkO2?usp=sharing"
                target="_blank"
                rel="manual book"
                class="download-doc"
              >
                <v-icon color="#3C7FBE" class="mr-2">mdi-download</v-icon>
                {{ $t("landing.footer.docs") }}</a
              >
            </v-btn>
          </v-col>
          <v-col
            v-else
            xl="2"
            lg="2"
            md="12"
            sm="12"
            xs="12"
            class="lp-footer text-center"
          >
            <v-btn width="100%" color="white" @click="showDownload = true">
              <v-icon color="#3C7FBE" class="mr-2">mdi-download</v-icon>
              {{ $t("landing.footer.docs") }}
            </v-btn>
          </v-col>
          <v-col
            v-if="user.role == 'executive'"
            xl="6"
            lg="6"
            md="12"
            sm="12"
            xs="12"
            class="lp-footer text-left"
          >
            <v-btn width="30%" color="white">
              <v-icon color="#3C7FBE" class="mr-2">mdi-face-agent</v-icon>
              {{ $t("landing.footer.contact_us") }}
            </v-btn>
          </v-col>
          <v-col
            v-else
            xl="3"
            lg="3"
            md="12"
            sm="12"
            xs="12"
            class="lp-footer text-left"
          >
            <v-btn
              :width="`${$vuetify.breakpoint.mdAndDown ? '100%' : '77%'} `"
              color="white"
            >
              <v-icon color="#3C7FBE" class="mr-2">mdi-face-agent</v-icon>
              {{ $t("landing.footer.contact_us") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider class="nav-footer"></v-divider>
      <div
        :class="[`${$vuetify.breakpoint.mdAndDown ? 'mx-5' : 'cpr-pmt'}`]"
        :style="[`${$vuetify.breakpoint.mdAndDown ? 'font-size: 10px' : ''}`]"
      >
        Copyright &copy; 2021
        <b> <u> Kementerian Komunikasi Dan Informatika.</u></b>
      </div>
    </div>
    <v-dialog width="30%" v-model="navigationModal">
      <v-card class="text-center">
        <div>
          <div class="pa-5 font-weight-bold" style="color: #645959">
            {{ modal_title }}
          </div>
          <v-divider></v-divider>
          <div class="pa-5">
            <div
              class="d-flex flex-column"
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
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      :width="`${$vuetify.breakpoint.mdAndDown ? '80%' : '30%'}`"
      v-model="showDownload"
    >
      <v-card class="pa-5" width="100%">
        <v-row class="pa-5">
          <v-col xl="12" lg="12" md="12" sm="12" cols="12">
            <v-row justify="center" align="center">
              <a :href="link_download_android" target="_blank" class="abutton">
                <img
                  width="100%"
                  src="../../../assets/image/download/downloadandroid.png"
                  alt="image7"
                />
              </a>
            </v-row>
          </v-col>
          <v-col xl="12" lg="12" md="12" sm="12" cols="12" class="mt-3">
            <v-row justify="center" align="center">
              <a
                :href="`itms-services://?action=download-manifest&url=${link_download_ios}`"
                target="_blank"
                class="abutton"
              >
                <img
                  width="100%"
                  src="../../../assets/image/download/downloadios.png"
                  alt="image7"
                />
              </a>
            </v-row>
          </v-col>

          <v-col xl="12" lg="12" md="12" sm="12" cols="12">
            <v-btn
              :href="link_download_manual_book_web"
              target="_blank"
              width="100%"
              elevation="0"
              color="#169CD6"
              class="white--text pa-2 mb-3"
            >
              Manual Book Web
            </v-btn>
            <v-btn
              :href="link_download_manual_book_mobile"
              target="_blank"
              width="100%"
              elevation="0"
              color="#169CD6"
              class="white--text pa-2"
            >
              Manual Book Mobile
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

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

    <v-overlay :z-index="999" :value="loading_overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </section>
</template>

<script src="./LandingPage.js"></script>

<style lang="scss" src="./LandingPage.scss" scoped></style>
