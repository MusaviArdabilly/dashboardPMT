<template>
	<div class="table-content">
		<div class="title">
			<h4>{{ $t("general.menu.user_management") }}</h4>
		</div>
		<v-card>
			<v-data-table
				:loading="loading"
				:headers="headers"
				:items="data"
				hide-default-footer
				disable-pagination
			>
				<template v-slot:top>
					<div class="pmt-flex wrap is-row pt-5">
						<v-col cols="2" xl="2">
							<v-btn
								@click="dialog = true"
								class="text-none mr-4 white--text"
								color="#134889"
								>{{ $t("ui.button_create") }}</v-btn
							>
						</v-col>
						<v-col cols="4" xl="4">
							<v-text-field
								class="ml-5"
								outlined
								prepend-inner-icon="mdi-magnify"
								:placeholder="$t('ui.table_piece.search')"
								dense
								v-model="search"
								@input="tableChange"
							></v-text-field>
						</v-col>
						<v-col cols="6" xl="6">
							<div class="pmt-flex wrap is-row at-end">
								<div class="mr-5 mt-2">Filters:</div>
								<v-col class="pa-0" cols="8" xl="9">
									<div class="pmt-flex wrap is-row">
										<v-col class="pa-0" cols="4">
											<v-select
												solo
												dense
												placeholder="Role"
												@change="tableChange"
												:items="role_filter"
												v-model="selected_role"
												item-text="name"
												item-value="name"
												class="mr-5"
											></v-select>
										</v-col>
										<v-col class="pa-0" cols="4">
											<v-select
												solo
												dense
												placeholder="Status"
												@change="tableChange"
												v-model="selected_status"
												:items="list_status"
												item-text="name"
												item-value="value"
												class="mr-5"
											></v-select>
										</v-col>
										<v-col class="pa-0" cols="4">
											<v-select
												solo
												dense
												placeholder="Is Verified"
												@change="tableChange"
												v-model="selected_is_verified"
												:items="list_is_verified"
												item-text="name"
												item-value="value"
											></v-select>
										</v-col>
									</div>
								</v-col>
							</div>
						</v-col>
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
								<v-form
									ref="formcreate"
									v-model="valid"
									lazy-validation
								>
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
										:append-icon="
											show ? 'mdi-eye' : 'mdi-eye-off'
										"
										:type="show ? 'text' : 'password'"
										@click:append="show = !show"
										:rules="rules"
									></v-text-field>
									<div>Institution</div>
									<v-select
										v-model="selected_department"
										outlined
										dense
										placeholder="Institution"
										:rules="rules"
										:items="department"
										return-object
										item-text="name"
									></v-select>
									<!-- <div>Position</div>
                    <v-select
                      v-model="selected_position"
                      outlined
                      dense
                      placeholder="Position"
                      :rules="rules"
                      :items="position"
                      item-text="name"
                      item-value="path"
                    ></v-select> -->
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
									<template
										v-if="
											selected_role == 'network-operator'
										"
									>
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
					</v-dialog>

					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="headline"
								>Are you sure you want to delete this
								item?</v-card-title
							>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									color="blue darken-1"
									text
									@click="closeDelete"
									>Cancel</v-btn
								>
								<v-btn
									color="blue darken-1"
									text
									@click="deleteItemConfirm"
									>OK</v-btn
								>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>

					<!-- DIALOG UPDATE -->
					<v-dialog v-model="dialog_update" max-width="500px">
						<v-card>
							<div class="pa-5 font-weight-bold d-flex">
								Update User
								<v-spacer></v-spacer>
								<v-icon @click="dialog_update = false"
									>mdi-close</v-icon
								>
							</div>
							<v-divider></v-divider>
							<div class="pa-5">
								<v-form
									ref="formupdate"
									v-model="valid"
									lazy-validation
								>
									<div>Username</div>
									<v-text-field
										v-model="form_update.username"
										outlined
										dense
										disabled
										placeholder="Username"
										:rules="rules"
									></v-text-field>
									<div>Firstname</div>
									<v-text-field
										v-model="form_update.first_name"
										outlined
										dense
										placeholder="Firstname"
										:rules="rules"
									></v-text-field>
									<div>Lastname</div>
									<v-text-field
										v-model="form_update.last_name"
										outlined
										dense
										placeholder="Lastname"
										:rules="rules"
									></v-text-field>
									<div>Email</div>
									<v-text-field
										v-model="form_update.email"
										outlined
										disabled
										dense
										placeholder="Email"
										:rules="rules"
									></v-text-field>
									<div>Institution</div>
									<v-select
										v-model="
											form_update.selected_department
										"
										outlined
										dense
										placeholder="Institution"
										:rules="rules"
										:items="department"
										return-object
										item-text="name"
										readonly
										disabled
									></v-select>
									<!-- <div>Position</div>
                    <v-select
                      v-model="form_update.selected_position"
                      outlined
                      dense
                      placeholder="Position"
                      :rules="rules"
                      :items="position"
                      item-text="name"
                      item-value="path"
                    ></v-select> -->
									<div>Role</div>
									<v-select
										v-model="form_update.role"
										outlined
										dense
										disabled
										placeholder="Role"
										:rules="rules"
										:items="role"
										item-text="name"
										item-value="name"
									></v-select>
									<div>Status</div>
									<v-switch
										class="ml-3"
										v-model="form_update.is_active"
										:label="
											form_update.is_active
												? 'Active'
												: 'Inactive'
										"
										inset
									></v-switch>
									<div>Is Viewer</div>
									<v-switch
										class="ml-3"
										v-model="form_update.is_viewer"
										:label="
											form_update.is_viewer ? 'Yes' : 'No'
										"
										inset
									></v-switch>
									<v-btn
										@click="updateUser"
										elevation="0"
										class="text-capitalize white--text"
										width="100%"
										color="#134889"
										>Submit</v-btn
									>
								</v-form>
							</div>
						</v-card>
					</v-dialog>
				</template>

				<template v-slot:item.status="{ item }">
					<v-chip
						v-if="item.is_active && item.is_verified"
						class="ma-2"
						color="green"
						text-color="white"
					>
						Active
					</v-chip>
					<v-chip
						v-else
						class="ma-2"
						color="warning"
						text-color="white"
					>
						Non-Active
					</v-chip>
				</template>

				<template v-slot:item.image="{ item }">
					<v-avatar size="50" class="ma-2">
						<v-img
							height="100%"
							:src="pmt_url + item.avatar"
							:alt="item.name"
						></v-img>
					</v-avatar>
				</template>

				<template v-slot:item.actions="{ item }">
					<v-icon class="mr-2" @click="editItem(item)">
						mdi-square-edit-outline
					</v-icon>
					<v-tooltip top>
						<template v-slot:activator="{ on }">
							<v-icon
								v-on="on"
								small
								v-if="!item.is_verified"
								@click="resendEmailVerification(item.email)"
							>
								mdi-send
							</v-icon>
						</template>
						<span>Resend Email Verification</span>
					</v-tooltip>
				</template>

				<template v-slot:item.name="{ item }">
					<p>{{ item.first_name }} {{ item.last_name }}</p>
					<!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
				</template>

				<template v-slot:no-data>
					<div class="pa-5">
						<img
							height="300px"
							src="../../../assets/image/empty.svg"
							alt="no data"
						/>
						<div>No Data</div>
						<v-btn color="primary" @click="tableChange">
							Reset
						</v-btn>
					</div>
				</template>
			</v-data-table>
			<v-container class="max-width">
				<v-row justify="end" align="center">
					<v-col cols="2">
						<v-select
							:items="pagination.rowsPerPageItems"
							class="item-per-page"
							v-model="pagination.rowsPerPage"
							@change="tableChange"
						></v-select>
					</v-col>
				</v-row>
				<v-pagination
					v-model="pagination.page"
					class="my-4"
					:total-visible="7"
					:length="pagination.totalItems"
					@input="initialize"
				></v-pagination>
			</v-container>
		</v-card>
		<v-overlay :z-index="999" :value="loading_overlay">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
	</div>
</template>

<script src="./UserManagement.js"></script>

<style lang="scss" src="./UserManagement.scss" scoped></style>
