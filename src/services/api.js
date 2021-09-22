import axios from "axios";

let url = "https://authenticator-match-projetos.herokuapp.com";


const API = axios.create({baseURL: url});

export default API;