import axios from "axios";
import { DIARY_API } from '../config';

function findAll() {
    return axios
        .get(DIARY_API)
        .then(response => response.data['hydra:member']);
}

function find(id) {
    return axios
            .get( DIARY_API + "/" + id)
            .then(response => response.data);
}

function update(id, diary) {
    return axios
        .put(DIARY_API + "/" + id,
             { ...diary, clients: `/api/clients/${diary.clients}`});
}

function create(diary) {
    return axios
        .post(DIARY_API, {...diary, clients: `/api/clients/${diary.clients}`});
}

function deleteDiary(id) {
    return axios
        .delete(DIARY_API + "/" + id);
}

export default { findAll, find, create, update, delete: deleteDiary };