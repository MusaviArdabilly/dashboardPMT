import CryptoJS from 'crypto-js'

const ID_TOKEN_KEY = "id_token";
const USER_DATA = "user_data";

export const getToken = () => {

    var encryptedData = window.localStorage.getItem(ID_TOKEN_KEY);

    if (encryptedData != null) {
        var bytes = CryptoJS.AES.decrypt(encryptedData, 'K0m1nf0@2021');
        var originalData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }

    if (originalData == undefined) {
        return null
    }

    return originalData
};

export const getUser = () => {

    var encryptedData = window.localStorage.getItem(USER_DATA);
    if (encryptedData != null) {
        var bytes = CryptoJS.AES.decrypt(encryptedData, 'K0m1nf0@2021');
        var originalData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }

    if (originalData == undefined) {
        return null
    }

    return originalData
};

export const saveToken = token => {
    return window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const saveUserData = data => {
    return window.localStorage.setItem(USER_DATA, data);
};

export const destroyToken = () => {
    window.localStorage.removeItem(ID_TOKEN_KEY);
};

export const destroyUserData = () => {
    window.localStorage.removeItem(USER_DATA);
};

export default { getToken, getUser, saveToken, saveUserData, destroyToken, destroyUserData };
