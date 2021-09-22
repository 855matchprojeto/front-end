import axios from "axios";

let url = "https://authenticator-match-projetos.herokuapp.com";


const api = axios.create({
    baseURL: url,
});

export default api;