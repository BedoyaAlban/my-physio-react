import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from '../config';

/**
 *  Suppression du token dans le localStorage et sur Axios (Déconnexion)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {object} credentials 
 */
function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            //Stockage du token dans le localeStrorage
            window.localStorage.setItem("authToken", token);
            // On prévient axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
            setAxiosToken(token);
        });
}

/**
 * Ajout du token JWT dans Axios
 * @param {string} token le token jwt 
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}


/**
 * Mise en place lors du chargement de l'Application
 */
function setup() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        } 
    }
}

/**
 * Permet de savoir si nous sommes authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};