import axios from "axios";

function findAll() {
    return axios
        .get("http://127.0.0.1:8000/api/diaries")
        .then(response => response.data['hydra:member']);
}

function find(id) {
    return axios
            .get("http://127.0.0.1:8000/api/diaries/" + id)
            .then(response => response.data);
}

function update(id, diary) {
    return axios
        .put("http://127.0.0.1:8000/api/diaries/" + id,
             { ...diary, clients: `/api/clients/${diary.clients}`});
}

function create(diary) {
    return axios
        .post("http://127.0.0.1:8000/api/diaries", {...diary, clients: `/api/clients/${diary.clients}`});
}

function deleteDiary(id) {
    return axios
        .delete("http://127.0.0.1:8000/api/diaries/" + id);
}

export default { findAll, find, create, update, delete: deleteDiary };