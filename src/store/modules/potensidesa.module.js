import JwtService from "../../services/jwt.services";
import PmtCheckbox from "../../assets/image/pmt-checkbox.png";
import Swal from "sweetalert2";
import moment from "moment";

export function buildUrl(url, queryParams) {
  const query = new URLSearchParams();
  if (queryParams)
    Object.keys(queryParams).forEach((name) => {
      query.set(name, queryParams[name]);
    });
  return `${url}?${query}`;
}

const state = {
  dataFieldDesaDefined: {
    data: [
      {
        name: "Potensi Desa",
        fields: [
          {
            id: 1,
            name: "Luas Wilayah",
            field_name: "luas_wilayah",
            unit: "m2",
          },
          {
            id: 2,
            name: "Luas Pemukiman",
            field_name: "luas_pemukiman",
            unit: "m2",
          },
        ],
      },
      {
        name: "Administrasi Desa",
        fields: [
          {
            id: 3,
            name: "Kantor Desa",
            field_name: "kantor_desa",
            unit: "",
          },
          {
            id: 4,
            name: "Koordinat Kantor Desa",
            field_name: "koordinat_kantor_desa",
            unit: "",
          },
        ],
      },
    ],
  },
  dataDesa: [
    {
      object_id: 98951,
      province: {
        id: 33,
        name: "Jawa Tengah",
      },
      city: {
        id: 3327,
        name: "Pemalang",
      },
      district: {
        id: 332703,
        name: "Belik",
      },
      sub_district: {
        id: 3327032006,
        name: "Gunungjaya",
      },
      data: [
        {
          id: 1,
          name: "Luas Wilayah",
          value: "14.37850131",
        },
        {
          id: 2,
          name: "Luas Pemukiman",
          value: "0.223286",
        },
      ],
      created_at: "2022-07-21 09:36:09.633 +0700",
      updated_at: "2022-07-21 09:36:09.633 +0700",
      updated_by: "Admin",
    },
    {
      object_id: 98952,
      province: {
        id: 33,
        name: "Jawa Barat",
      },
      city: {
        id: 3327,
        name: "Bogor",
      },
      district: {
        id: 332703,
        name: "Tanah Sareal",
      },
      sub_district: {
        id: 3327032006,
        name: "Cimanggu Raya",
      },
      data: [
        {
          id: 1,
          name: "Luas Wilayah",
          value: "15.9950",
        },
        {
          id: 2,
          name: "Luas Pemukiman",
          value: "18.999",
        },
        {
          id: 3,
          name: "Sinyal",
          value: "89",
        },
      ],
      created_at: "2022-07-21 09:36:09.633 +0700",
      updated_at: "2022-07-21 09:36:09.633 +0700",
      updated_by: "Admin",
    },
    {
      object_id: 98953,
      province: {
        id: 33,
        name: "Jawa Barat",
      },
      city: {
        id: 3327,
        name: "Bogor",
      },
      district: {
        id: 332703,
        name: "Bogor Tengah",
      },
      sub_district: {
        id: 3327032006,
        name: "Margaraya",
      },
      data: [
        {
          id: 1,
          name: "Luas Wilayah",
          value: "15.9950",
        },
        {
          id: 2,
          name: "Luas Pemukiman",
          value: "18.999",
        },
        {
          id: 3,
          name: "Sinyal",
          value: "89",
        },
        {
          id: 4,
          name: "Lainnya",
          value: "10",
        },
      ],
      created_at: "2022-07-21 09:36:09.633 +0700",
      updated_at: "2022-07-21 09:36:09.633 +0700",
      updated_by: "Admin",
    },
  ],
  headersTablePotensi: [],
  dataDesaFetch: [],
  tablePotensiDesa: {
    limit: 10,
    page: 1,
    sort: "desc",
    filters: "",
    // filters: `[["province_id",11],["city_id",1101],["district_id",1101]]`,
  },
  downloadUrl: "",
};
const mutations = {
  setDataDesa(state, payload) {
    const headers = [
      {
        text: "Province",
        align: "start",
        sortable: false,
        value: "province.name",
      },
      {
        text: "City",
        value: "city.name",
        sortable: false,
      },
      {
        text: "District",
        value: "district.name",
        sortable: false,
      },
      {
        text: "Sub District",
        value: "sub_district.name",
        sortable: false,
      },
      // { text: '', value: 'data-table-expand' }
    ];
    const payloadMapped = {
      data: [],
      list_header: payload.list_header,
      pagination: payload.pagination,
    };
    payload.data.forEach((item) => {
      // console.log(parentIndex);
      payloadMapped.data.push({
        ["object_id"]: item.object_id,
        ["province"]: { name: item.province.name },
        ["city"]: { name: item.city.name },
        ["district"]: { name: item.district.name },
        ["sub_district_id"]: item.sub_district_id,
        ["sub_district"]: { name: item.sub_district.name },
        ["data"]: item.data,
      });
      for (var [key, value] of Object.entries(item.data)) {
        headers.push({
          text: value.name,
          value: `data.${key}.value`,
        });
        if (
          (JwtService.getUser().role == "executive" ||
            JwtService.getUser().role == "operator" ||
            JwtService.getUser().role == "viewer") == false
        ) {
          headers.push({
            text: "Action",
            value: "object_id",
          });
        }
      }
    });
    const mapping = headers.map((o) => o.text);
    const filtered = headers.filter(
      ({ text }, index) => !mapping.includes(text, index + 1)
    );
    state.headersTablePotensi = filtered;
    state.dataDesaFetch = payloadMapped;
  },
  setDownloadUrl(state, payload) {
    state.downloadUrl = payload;
  },
};
const getters = {
  headersPotensiDesa: (state) => state.headersTablePotensi,
  tablePotensiDesa: (state) => state.tablePotensiDesa,
  getDataFieldDesa: (state) => state.dataFieldDesa,
  getDataDesa: (state) => state.dataDesaFetch,
  getDataDesaDummy(state) {
    return state.dataDesa;
  },
  getDownloadUrl: (state) => state.downloadUrl,
};
const actions = {
  fetchPotensiDesa(context, request) {
    const url = new URL(process.env.VUE_APP_API_URL + `api/v1/id/sdp`);
    // console.log(request);
    const buildedUrl = buildUrl(url, request);
    fetch(buildedUrl, {
      methods: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error != true) {
          this.commit("response", result.error);
          this.commit("loadingData", false);
          context.commit("setDataDesa", result.data);
          this.commit("loadingTable", false);
        } else {
          this.commit("response", result.error);
          this.commit("loadingData", false);
          this.commit("loadingTable", false);
        }
      })
      .catch((error) => console.log("error", error));
  },
  downloadDataPotensiDesa(context, request) {
    const url = new URL(
      process.env.VUE_APP_API_URL + `api/v1/id/sdp/download-potensi-desa`
    );
    const buildedUrl = buildUrl(url, request);
    const filedate = moment().format("YYYY-MM-DD-HH-mm");
    const filename = `${request.export}-${filedate}.xlsx`;
    fetch(buildedUrl, {
      methods: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    })
      .then((response) => {
        if (response.status != 500) {
          response.blob().then((blob) => {
            this.commit("loadingCircle", false);
            const url = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
          });
          Swal.fire({
            title: "<h5>Data desa berhasil didownload!</h5>",
            iconHtml: `<img src="${PmtCheckbox}" width="100">`,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonColor: "#134889",
            confirmButtonText: "Ok",
            timer: 3000,
          });
        } else {
          Swal.fire({
            title: "Data tidak ditemukan",
            text: response.message,
            icon: "error",
            showConfirmButton: true,
            confirmButtonColor: "#134889",
            timer: 3000,
          });
          this.commit("loadingCircle", false);
        }
      })
      .catch((error) => console.log("error", error));
  },
  deletePotensiDesa(context, request) {
    return fetch(process.env.VUE_APP_API_URL + `api/v1/id/sdp/` + request, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JwtService.getToken()}`,
      },
    });
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
