import axios from "axios";

function findAll() {
    return axios
        .get("http://127.0.0.1:8000/api/clients")
        .then(response => response.data['hydra:member']);
}

function find(id) {
    return axios
        .get("http://127.0.0.1:8000/api/clients/" + id)
        .then(response => response.data);
}

function update(id, client) {
    return axios
        .put("http://127.0.0.1:8000/api/clients/" + id, client);
}

function create(client) {
    return axios
        .post("http://127.0.0.1:8000/api/clients", client);
}

function deleteClient(id) {
        return axios
        .delete("http://127.0.0.1:8000/api/clients/" + id);
}

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteClient
};