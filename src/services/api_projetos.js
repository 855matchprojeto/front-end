import axios from "axios";
import { getToken } from "./auth";

// chamadas de Projeto
let urlProjeto = "https://projetos-match-projetos.herokuapp.com";
const proj = axios.create({baseURL: urlProjeto});

proj.interceptors.request.use(async (options) => {
    options.headers["Content-Type"] = "application/json"
    options.headers["Authorization"] = `Bearer ${getToken}`
    return options
})

proj.interceptors.response.use(
    res => { return res },
    error => {
        throw error
    }
)

export const getProjetos = async (dados) => {
    if (dados === "")
        return proj.get(`/projetos`).then(res => res)
    else
        return proj.get(`/projetos`,{ params: {id:dados}}).then(res => res)
}