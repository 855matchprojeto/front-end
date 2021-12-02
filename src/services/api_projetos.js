import axios from "axios";
import { getToken } from "./auth";
import { logout } from "./auth";

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
        if (error.response.status === 403 || error.response.status === 401){
            logout()
        }
        throw error
    }
)

export const getProjetos = async (dados,isID) => {
    if (isID)
        return proj.get(`/projetos`,{ params: {id:dados}}).then(res => res)
    else if (dados === "")
        return proj.get(`/projetos`).then(res => res)
    else
        return proj.get(`/projetos`,{ params: {titulo_ilike:dados}}).then(res => res)
}

export const postProjetos = async (dados) => {
    return proj.post(`/projetos`,dados).then(res => res)
}

export const getProjetosInteresses = async () => {
    return proj.get(`/users/me/projects/interested-in`).then(res => res)
}

export const getMeusProjetos = async () => {
    return proj.get(`/users/me/projects`).then(res => res)
}

export const postInteresseProjeto = async (guid) => {
    return proj.post(`/users/me/project/${guid}/user-project-interest`)
}

export const deleteInteresseProjeto = async (guid) => {
    return proj.delete(`/users/me/project/${guid}/user-project-interest`)
}