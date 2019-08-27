import axios from "axios";
import { CLIENTS_API } from '../config';

function findAll() {
    return axios
        .get( CLIENTS_API)
        .then(response => response.data['hydra:member']);
}

function find(id) {
    return axios
        .get( CLIENTS_API + "/" + id)
        .then(response => response.data);
}

function update(id, client) {
    return axios
        .put( CLIENTS_API + "/" + id, client);
}

function create(client) {
    return axios
        .post(CLIENTS_API, client);
}

function deleteClient(id) {
        return axios
        .delete(CLIENTS_API + "/" + id);
}


export default {
    findAll,
    find,
    update,
    create,
    delete: deleteClient
};