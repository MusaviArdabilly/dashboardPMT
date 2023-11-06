<template>
  <div class="dashboard">
    <!-- <NavBar /> -->
    
    <div class="pa-4">
      <div class="font-weight-bold mt-5 mb-5" style="font-size: 24px">
        Telecommunication Infrastructure
      </div>
      <v-row>
        <v-col cols="auto">
          <v-btn rounded="xl" class="px-7">
            Operator Cellular
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn disabled rounded="xl" class="px-7">
            Fixed Boardband
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn disabled rounded="xl" class="px-7">
            Data Pos
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn disabled rounded="xl" class="px-7">
            Data Penyiaran TV
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn disabled rounded="xl" class="px-7">
            Data Penyiaran Radio
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="8">
          <v-card class="pa-10">
            <v-row class="d-flex justify-space-between">
              <div class="d-flex align-center">
                <h1 class="mr-8 my-0">Tickets</h1>
                <v-btn-toggle v-model="toggle_tickets" rounded="xl" size="small">
                  <v-btn rounded="xl" class="px-7" size="small" style="font-size: 12px; height: 32px;">Total Ticket</v-btn>
                  <v-btn rounded="xl" class="px-7" size="small" style="font-size: 12px; height: 32px;">Opened Ticket</v-btn>
                  <v-btn rounded="xl" class="px-7" size="small" style="font-size: 12px; height: 32px;">Closed Ticket</v-btn>
                </v-btn-toggle>
              </div>
              <div class="d-flex align-center">
                <dropdown-menu>
                  <li><a href="#">Last 7 Days</a></li>
                  <li><a href="#">Last 15 Days</a></li>
                  <li><a href="#">Last 30 Days</a></li>
                  <li >
                    <template>
                      <div class="text-center">
                        <v-btn
                          style="box-shadow: none; background-color: transparent; padding: 0 !important; margin: 0 !important; height: 15px !important; "
                          @click="dialog = true"
                        >
                          Custom Date
                        </v-btn>

                        <v-dialog
                          v-model="dialog"
                          width="auto"
                        >
                          <v-card class="pa-4">
                            <v-card-text class="d-flex align-center">
                              <div class="elevation-2 rounded pa-2">
                                <input type="date" id="startDate" class="datepicker" data-toggle="flatpickr">
                              </div>
                              <h3 class="mx-4">To</h3>
                              <div class="elevation-2 rounded pa-2">
                                <input type="date" id="endDate" class="datepicker" data-toggle="flatpickr">
                              </div>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn color="primary" class="ml-auto" @click="dialog = false">Apply</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>
                    </template>
                  </li>
                </dropdown-menu>
              </div>
            </v-row>
            <v-row>
              <v-col cols="12">
                <MultiColumnChart />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="pa-10" style="height: 100%;">
            <v-row class="d-flex justify-space-between">
              <div>
                <h1 class="mr-8 my-0">Tickets</h1>
                <p>38.4k Tickets</p>
              </div>
              <div class="d-flex align-start mt-4">
                <dropdown-menu>
                  <li><a href="#">Last 7 Days</a></li>
                  <li><a href="#">Last 15 Days</a></li>
                  <li><a href="#">Last 30 Days</a></li>
                  <li >
                    <template>
                      <div class="text-center">
                        <v-btn
                          style="box-shadow: none; background-color: transparent; padding: 0 !important; margin: 0 !important; height: 15px !important; "
                          @click="dialog = true"
                        >
                          Custom Date
                        </v-btn>

                        <v-dialog
                          v-model="dialog"
                          width="auto"
                        >
                          <v-card class="pa-4">
                            <v-card-text class="d-flex align-center">
                              <div class="elevation-2 rounded pa-2">
                                <input type="date" id="startDate" class="datepicker" data-toggle="flatpickr">
                              </div>
                              <h3 class="mx-4">To</h3>
                              <div class="elevation-2 rounded pa-2">
                                <input type="date" id="endDate" class="datepicker" data-toggle="flatpickr">
                              </div>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn color="primary" class="ml-auto" @click="dialog = false">Apply</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>
                    </template>
                  </li>
                </dropdown-menu>
              </div>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="align-center font-weight-medium">
                    <v-btn disabled class="pa-4 w-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                    </v-btn>
                    Twitter
                  </div>
                  <div class="font-weight-medium">
                    1.2k
                    <span class="rounded pa-2 ml-4" style="background-color: #dff7e9;">+4.2%</span>
                  </div>
                </div>
                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="align-center font-weight-medium">
                    <v-btn disabled class="pa-4 w-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                    </v-btn>
                    Facebook
                  </div>
                  <div class="font-weight-medium">
                    1.2k
                    <span class="rounded pa-2 ml-4" style="background-color: #dff7e9;">+4.2%</span>
                  </div>
                </div>
                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="align-center font-weight-medium">
                    <v-btn disabled class="pa-4 w-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                    </v-btn>
                    Instagram
                  </div>
                  <div class="font-weight-medium">
                    1.2k
                    <span class="rounded pa-2 ml-4" style="background-color: #dff7e9;">+4.2%</span>
                  </div>
                </div>
                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="align-center font-weight-medium">
                    <v-btn disabled class="pa-4 w-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                    </v-btn>
                    Others
                  </div>
                  <div class="font-weight-medium">
                    1.2k
                    <span class="rounded pa-2 ml-4" style="background-color: #dff7e9;">+4.2%</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="pa-10">
            <v-row class="d-flex justify-space-between">
              <div class="d-flex">
                <div>
                  <h1 class="mr-8 my-0">Social Media</h1>
                  <p>Social Media Analytics</p>
                </div>
                <v-btn-toggle class="mt-1" v-model="toggle_social_media" rounded="xl" size="small">
                  <v-btn rounded="xl" class="px-7" size="small" style="font-size: 12px; height: 32px;">Reach</v-btn>
                  <v-btn rounded="xl" class="px-7" size="small" style="font-size: 12px; height: 32px;">Mention</v-btn>
                </v-btn-toggle>
              </div>
              <div class="d-flex align-start mt-4">
                <dropdown-menu>
                  <li><a href="#">Last 7 Days</a></li>
                  <li><a href="#">Last 15 Days</a></li>
                  <li><a href="#">Last 30 Days</a></li>
                  <li >
                    <template>
                      <div class="text-center">
                        <v-btn
                          style="box-shadow: none; background-color: transparent; padding: 0 !important; margin: 0 !important; height: 15px !important; "
                          @click="dialog = true"
                        >
                          Custom Date
                        </v-btn>

                        <v-dialog
                          v-model="dialog"
                          width="auto"
                        >
                          <v-card class="pa-4">
                            <v-card-text class="d-flex align-center">
                              <div class="elevation-2 rounded pa-2">
                                <input type="date" id="startDate" class="datepicker" data-toggle="flatpickr">
                              </div>
                              <h3 class="mx-4">To</h3>
                              <div class="elevation-2 rounded pa-2">
                                <input type="date" id="endDate" class="datepicker" data-toggle="flatpickr">
                              </div>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn color="primary" class="ml-auto" @click="dialog = false">Apply</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>
                    </template>
                  </li>
                </dropdown-menu>
              </div>
            </v-row>
            <v-row>
              <v-col cols="12">
                <LineChart />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="8">
          <v-card class="pa-10">
            <v-text-field label="Search"></v-text-field>
            <div>
              <v-row class="px-16">
                <v-col cols="8"></v-col>
                <v-col cols="4" class="d-flex justify-space-end mb-4">
                  <v-pagination :length="12"></v-pagination>
                </v-col>
              </v-row>
              <div class="py-4">
                <v-row>
                  <v-col cols="9">
                    <div class="d-flex align-center font-weight-medium">
                      <v-btn disabled class="pa-4 mr-4" style="width: 60px; height: 60px;">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                      </v-btn>
                      <div class="d-flex flex-column">
                        <h3 class="d-inline">Upload Foto Kamu ala JKT 46</h3>
                        <p class="d-inline mb-0">Instagram</p>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="3">
                    <v-btn rounded="xl" class="px-7 float-right" size="small" style="font-size: 12px; height: 32px;">Create Ticket</v-btn>
                  </v-col>
                </v-row>
                <v-row class="pa-3">
                  <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis sagittis sagittis. Morbi mollis sapien quis magna euismod porta. Quisque vel ornare eros, vel pellentesque justo. Nullam eros tortor, vestibulum sed viverra congue, tempus vel enim. Sed eleifend, enim eu hendrerit vulputate, sem tortor venenatis sem, nec tempus sapien urna sit amet diam. Morbi sit amet pellentesque eros.</p>
                </v-row>
                <v-row>
                  <v-col cols="6" class="d-flex align-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"/></svg>
                    <p class="ml-2 mr-4 mb-0">123</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z"/></svg>
                    <p class="ml-2 mb-0">123</p>
                  </v-col>
                  <v-col cols="6">
                    <v-btn disabled class="pa-2 float-right" size="small" style="font-size: 12px; height: 20px; color: #000000;">Neutral</v-btn>
                  </v-col>
                </v-row>
              </div>
              <div class="py-4">
                <v-row>
                  <v-col cols="9">
                    <div class="d-flex align-center font-weight-medium">
                      <v-btn disabled class="pa-4 mr-4" style="width: 60px; height: 60px;">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                      </v-btn>
                      <div class="d-flex flex-column">
                        <h3 class="d-inline">Upload Foto Kamu ala JKT 46</h3>
                        <p class="d-inline mb-0">Instagram</p>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="3">
                    <v-btn rounded="xl" class="px-7 float-right" size="small" style="font-size: 12px; height: 32px;">Create Ticket</v-btn>
                  </v-col>
                </v-row>
                <v-row class="pa-3">
                  <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis sagittis sagittis. Morbi mollis sapien quis magna euismod porta. Quisque vel ornare eros, vel pellentesque justo. Nullam eros tortor, vestibulum sed viverra congue, tempus vel enim. Sed eleifend, enim eu hendrerit vulputate, sem tortor venenatis sem, nec tempus sapien urna sit amet diam. Morbi sit amet pellentesque eros.</p>
                </v-row>
                <v-row>
                  <v-col cols="6" class="d-flex align-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"/></svg>
                    <p class="ml-2 mr-4 mb-0">123</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z"/></svg>
                    <p class="ml-2 mb-0">123</p>
                  </v-col>
                  <v-col cols="6">
                    <v-btn disabled class="pa-2 float-right" size="small" style="font-size: 12px; height: 20px; color: #000000;">Positive</v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="pa-10" style="height: 100%;">
            <div class="d-flex justify-end mb-8">
              <dropdown-menu>
                <li><a href="#">Last 7 Days</a></li>
                <li><a href="#">Last 15 Days</a></li>
                <li><a href="#">Last 30 Days</a></li>
                <li >
                  <template>
                    <div class="text-center">
                      <v-btn
                        style="box-shadow: none; background-color: transparent; padding: 0 !important; margin: 0 !important; height: 15px !important; "
                        @click="dialog = true"
                      >
                        Custom Date
                      </v-btn>

                      <v-dialog
                        v-model="dialog"
                        width="auto"
                      >
                        <v-card class="pa-4">
                          <v-card-text class="d-flex align-center">
                            <div class="elevation-2 rounded pa-2">
                              <input type="date" id="startDate" class="datepicker" data-toggle="flatpickr">
                            </div>
                            <h3 class="mx-4">To</h3>
                            <div class="elevation-2 rounded pa-2">
                              <input type="date" id="endDate" class="datepicker" data-toggle="flatpickr">
                            </div>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn color="primary" class="ml-auto" @click="dialog = false">Apply</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </template>
                </li>
              </dropdown-menu>
            </div>
            <div class="d-flex justify-space-between mb-8">
              <div class="d-flex align-center">
                <p class="mr-3 mb-0">Sources</p><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
              </div>
              <div>
                <a href="#">Show All</a> (9947)
              </div>
            </div>
            <v-row class="mb-8">
              <v-col cols="6" class="d-flex flex-column">
                <div class="d-flex">
                  <input type="checkbox" style="width: 16px; height: 16px;">&emsp;
                  <div style="width: 30px; text-align: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                  </div>
                  &emsp;Twitter
                </div>
                <div class="d-flex">
                  <input type="checkbox" style="width: 16px; height: 16px;">&emsp;
                  <div style="width: 30px; text-align: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                  </div>
                  &emsp;Instagram
                </div>
              </v-col>
              <v-col cols="6" class="d-flex flex-column">
                <div class="d-flex">
                  <input type="checkbox" style="width: 16px; height: 16px;">&emsp;
                  <div style="width: 30px; text-align: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                  </div>
                  &emsp;Facebook
                </div>
                <div class="d-flex">
                  <input type="checkbox" style="width: 16px; height: 16px;">&emsp;
                  <div style="width: 30px; text-align: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
                  </div>
                  &emsp;Others
                </div>
              </v-col>
            </v-row>
            
            <div class="d-flex flex-column">
              <div class="d-flex align-center mb-4">
                <p class="mr-3 mb-0">Sentiment</p><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
              </div>
              <div class="d-flex justify-space-between">
                <div class="d-flex align-center">
                  <input type="checkbox" style="width: 16px; height: 16px;">&emsp;
                  Negative
                </div>
                <div class="d-flex align-center">
                  <input type="checkbox" style="width: 16px; height: 16px;">&emsp;
                  Neutral
                </div>
                <div class="d-flex align-center">
                  <input type="checkbox" style="width: 16px; height: 16px;">&emsp;
                  Positive
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>






    <!-- <v-row class="mt-10">
      <v-col v-if="show_transmission == false" cols="2" class="d-flex">
        <v-select
          @input="changeOpsel"
          v-model="selected_opsel"
          :items="item_opsel"
          item-text="name"
          item-value="id"
          :item-disabled="checkIsItemDisabled"
          solo
          rounded
          dense
          placeholder="Network Operator"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          @input="changeTech"
          v-model="selected_tech"
          :disabled="disabled_tech"
          :background-color="disabled_tech ? 'grey lighten-3' : ''"
          :items="technology"
          item-text="name"
          item-value="id"
          :item-disabled="checkIsItemDisabled"
          solo
          rounded
          dense
          placeholder="2G"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-btn
          :disabled="disabled_filter"
          :background-color="disabled_filter ? 'grey lighten-3' : ''"
          elevation="0"
          rounded
          class="text-capitalize control-btn mr-5"
          outlined
          @click="showModal"
          >Filter <v-icon>mdi-filter-outline</v-icon>
        </v-btn>
        <v-btn
          rounded
          elevation="0"
          color="#169CD6"
          class="mr-5 text-capitalize white--text"
          >Submit</v-btn
        >
        <v-btn
          @click="resetFilter"
          rounded
          elevation="0"
          class="text-capitalize"
          >Reset</v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="d-flex justify-end">
        <v-btn
          elevation="0"
          rounded
          class="text-capitalize control-btn"
          outlined
          >Download <v-icon>mdi-file-download-outline</v-icon>
        </v-btn>
      </v-col>

      <v-col lg="6">
        <v-card elevation="5" class="pa-5">
          <v-skeleton-loader
            v-if="skeleton_loading"
            type="image"
          ></v-skeleton-loader>
          <ColumnChart v-else :series="series" />
        </v-card>
      </v-col>
      <v-col lg="6">
        <v-card elevation="5" class="pa-5">
          <v-skeleton-loader
            v-if="skeleton_loading"
            type="image"
          ></v-skeleton-loader>
          <CoverageAdminChart v-else :series="series_coverage" />
        </v-card>
      </v-col>
      <v-col v-if="show_transmission == false" lg="12">
        <v-card elevation="5" class="pa-5 map-card">
          <VueLayersMaps />
        </v-card>
      </v-col>
      <v-col v-if="show_transmission" lg="12">
        <v-row>
          <v-col lg="8">
            <v-card elevation="5" class="pa-5 map-card">
              <v-skeleton-loader
                v-if="skeleton_loading"
                type="image"
              ></v-skeleton-loader>
              <VueLayersMaps v-else :height="height" :id="id" />
            </v-card>
          </v-col>
          <v-col lg="4">
            <v-card elevation="5" class="pa-5">
              <v-skeleton-loader
                v-if="skeleton_loading"
                type="image"
              ></v-skeleton-loader>
              <div v-else>
                <div class="text-center font-weight-bold">
                  Daftar Fix Broadband
                </div>
                <v-text-field
                  prepend-inner-icon="mdi-magnify"
                  dense
                  outlined
                  class="mt-5"
                  rounded
                  placeholder="Pencarian"
                ></v-text-field>
                <div class="d-flex">
                  <div>Penyedia Layanan</div>
                  <v-spacer></v-spacer>
                  <div class="d-flex">
                    <div>Pilih Semua</div>
                    <v-checkbox dense></v-checkbox>
                  </div>
                </div>
                <div class="d-flex mt-4" v-for="i in 6" :key="i">
                  <div>Telkom Indonesia - IndiHome</div>
                  <v-spacer></v-spacer>
                  <v-checkbox dense></v-checkbox>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
    <component
      :is="selected_modal"
      :coverage="coverage"
      :coverage_bts="coverage_bts"
      :bts="bts"
      :transmission="transmission"
      v-on:closeCoverage="closeCoverage"
      v-on:closeCoverageBts="closeCoverageBts"
      v-on:closeBts="closeBts"
      v-on:closeTransmission="closeTransmission"
    />
  </div>
</template>

<script>
// import NavBar from "../../components/dashboard/NavBar.vue";
import JwtService from "../../../services/jwt.services";
import VueLayersMaps from "../../../components/dashboard/TelcoInfraMaps.vue";
import ColumnChart from "../../../components/dashboard/ColumnChart.vue";
import MultiColumnChart from "../../../components/dashboard/MultiColumnChart.vue";
import LineChart from "../../../components/dashboard/LineChart.vue";
import DropdownMenu from "../../../components/dashboard/DropdownMenu.vue";
import CoverageAdminChart from "../../../components/dashboard/CoverageAdminChart.vue";
import CoverageModal from "../../../components/dashboard/modal/CoverageModal.vue";
import CoverageBtsModal from "../../../components/dashboard/modal/CoverageBtsModal.vue";
import BtsModal from "../../../components/dashboard/modal/BtsModal.vue";
import TransmissionModal from "../../../components/dashboard/modal/TransmissionModal.vue";
import { GET_OPSEL } from "../../../store/modules/opsel.module";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default {
  components: {
    VueLayersMaps,
    ColumnChart,
    MultiColumnChart,
    DropdownMenu,
    LineChart,
    CoverageModal,
    CoverageAdminChart,
  },
  mounted() {
    flatpickr(".datepicker", {
      mode: 'single',
      dateFormat: 'd-F-Y',
    });
  },
  data: () => ({
    dialog: false,
    toggle_tickets: 0,
    toggle_social_media: 0,
    select: { state: 'Florida', abbr: 'FL' },
    items: [
      { state: 'Florida', abbr: 'FL' },
      { state: 'Georgia', abbr: 'GA' },
      { state: 'Nebraska', abbr: 'NE' },
      { state: 'California', abbr: 'CA' },
      { state: 'New York', abbr: 'NY' },
    ],
    series: [],
    series_coverage: [],
    height: "580px",
    id: "mapRounded",
    selected_tower: 0,
    selected_opsel: 0,
    show_transmission: false,
    skeleton_loading: true,
    selected_modal: "",
    coverage: false,
    coverage_bts: false,
    bts: false,
    transmission: false,
    telco_type: [],
    user_token: null,
    opsel: [
      {
        name: "Network Operator",
        id: 0,
      },
    ],
    technology: [
      {
        name: "Technology",
        id: 0,
      },
      {
        name: "2G",
        id: 1,
      },
      {
        name: "3G",
        id: 2,
      },
      {
        name: "4G",
        id: 3,
      },
    ],
    selected_tech: 0,
    disabled_opsel: true,
    disabled_tech: true,
    disabled_filter: true,
    map_layers: [],
    user: null,
    layer: [],
  }),

  computed: {
    item_opsel: function () {
      return this.$store.getters.item_opsel;
    },
  },
  methods: {
    changeView(value) {
      console.log(value);
      this.layer = value;
      if (value == "Fixed Broadband") {
        this.show_transmission = true;
        console.log(this.show_transmission);
        setTimeout(() => {
          this.skeleton_loading = false;
        }, 3000);
      } else {
        (this.disabled_opsel = false), (this.show_transmission = false);
      }
    },

    getOperator() {
      this.$store.dispatch(GET_OPSEL);
    },

    getMapLayer() {
      fetch(
        process.env.VUE_APP_API_URL +
          `api/v1/${this.user.language}/map-layer/category`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.user_token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.error == true) {
            console.log(result.message);
          } else {
            this.map_layers = result.data;
            console.log(this.map_layers);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showModal() {
      this.selected_modal = CoverageModal;
      this.coverage = true;
      switch (this.selected_tower) {
        case 1:
          {
            this.selected_modal = CoverageModal;
            this.coverage = true;
          }
          break;
        case 2:
          {
            this.selected_modal = CoverageBtsModal;
            this.coverage_bts = true;
          }
          break;
        case 3:
          {
            this.selected_modal = BtsModal;
            this.bts = true;
          }
          break;
        case 4:
          {
            this.selected_modal = TransmissionModal;
            this.transmission = true;
          }
          break;
      }
    },

    checkIsItemDisabled(item) {
      return item.id === 0;
    },

    closeCoverage(value) {
      this.coverage = value;
    },
    closeCoverageBts(value) {
      this.coverage_bts = value;
    },
    closeBts(value) {
      this.bts = value;
    },
    closeTransmission(value) {
      this.transmission = value;
    },

    changeOpsel() {
      if (this.selected_opsel != 0) {
        this.disabled_tech = false;
      }
    },

    changeTech() {
      if (this.selected_tech != 0) {
        this.disabled_filter = false;
      }
    },

    resetFilter() {
      this.selected_opsel = 0;
      this.selected_tech = 0;
    },

    getCoverageArea() {
      const url =
        "https://infragis.kominfo.go.id/webapi/graph/coveragearea?data=ALL";

      fetch(url)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.skeleton_loading = false;
          let very_good = [];
          let good = [];
          let fair = [];
          let bad = [];

          let series = [
            {
              name: "Baik Sekali",
              data: very_good,
            },
            {
              name: "Baik",
              data: good,
            },
            {
              name: "Cukup",
              data: fair,
            },
            {
              name: "Kurang",
              data: bad,
            },
          ];
          for (let i = 0; i < result.length; i++) {
            console.log(i);
            very_good[i] = result[i]["luas"]["Baik Sekali"];
            good[i] = result[i]["luas"]["Baik"];
            fair[i] = result[i]["luas"]["Cukup"];
            bad[i] = result[i]["luas"]["Kurang"];
          }

          this.series = series;
          console.log(this.series);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCoverageAdminArea() {
      const url =
        "https://infragis.kominfo.go.id/webapi/graph/coverageadmin?data=ALL";

      fetch(url)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.skeleton_loading = false;
          let province = [];
          let city = [];
          let district = [];
          let sub_district = [];

          let series = [
            {
              name: "Province",
              data: province,
            },
            {
              name: "Kota",
              data: city,
            },
            {
              name: "Kecamatan",
              data: district,
            },
            {
              name: "Kelurahan",
              data: sub_district,
            },
          ];
          for (let i = 0; i < result.length; i++) {
            console.log(i);
            province[i] = result[i]["jumlah_tercover"]["Provinsi"];
            city[i] = result[i]["jumlah_tercover"]["Kota"];
            district[i] = result[i]["jumlah_tercover"]["Kecamatan"];
            sub_district[i] = result[i]["jumlah_tercover"]["Kelurahan"];
          }

          this.series_coverage = series;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  created() {
    this.user_token = JwtService.getToken();
    this.user = JwtService.getUser();

    this.getOperator();
    this.getMapLayer();
    this.getCoverageArea();
    this.getCoverageAdminArea();
  },
};
</script>

<style scped>
.map-card {
  border-radius: 20px;
}

.v-input--selection-controls {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.v-sheet.v-card {
  border-radius: 10px;
}

.control-btn {
  color: #5e5873 !important;
}

.alarm-item {
  margin-top: 13.7px;
  margin-bottom: 13.7px;
}

.miniBarProgress {
  background-color: #8a898a;
  height: 100%;
  position: absolute;
  top: 0rem;
  border-radius: 20px;
  left: 0rem;
}

.miniBar {
  height: 20px;
  border: 1px solid #ffffff;
  border-radius: 20px;
  position: relative;
  width: -webkit-calc(100% - 2rem);
  width: -moz-calc(100% - 2rem);
  width: calc(100% - 2rem);
  margin-right: 0.5rem;
}

.v-progress-circular__underlay {
  stroke: #ebf57f !important;
}

.kecamatan .v-progress-circular__underlay {
  stroke: #a7dc65 !important;
}

.kabupaten .v-progress-circular__underlay {
  stroke: #65dc9a !important;
}

.province .v-progress-circular__underlay {
  stroke: #28c76f !important;
}

.v-progress-circular__info {
  color: black;
}
</style>
