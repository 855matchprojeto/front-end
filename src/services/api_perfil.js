import axios from "axios";
import { getToken } from "./auth";
import { logout } from "./auth";

// chamadas de Perfil
let urlPerfil = "https://perfis-match-projetos.herokuapp.com";
const perf = axios.create({baseURL: urlPerfil});

perf.interceptors.request.use(async (options) => {
    options.headers["Content-Type"] = "application/json"
    options.headers["Authorization"] = `Bearer ${getToken}`
    return options
})

perf.interceptors.response.use(
    res => { return res },
    error => {
        if (error.response.status === 403 || error.response.status === 401){
            logout()
        }
        throw error
    }
)

export const doHandleDelete = async (dados) => {
    return perf.delete(`/profiles/user/me/link-interest/${dados.id}`).then(res => res)
}

export const doHandleDeleteCourses = async (dados) => {
    return perf.delete(`/profiles/user/me/link-course/${dados.id}`).then(res => res)
}

export const doGetDataUser = async () => {
    return perf.get(`/profiles/user/me`).then(res => res)
};

export const doAdicionaCurso = async (id) => {
    return perf.post(`/profiles/user/me/link-course/${id}`).then(res => res)
}

export const doAdicionaInteresse = async (id) => {
    return perf.post(`/profiles/user/me/link-interest/${id}`).then(res => res)
}

export const doGetAllCourses = async () => {
    return perf.get(`/courses`).then(res => res)
}

export const doHandleChangeCourses = async (value) => {
    return perf.post(`/profiles/user/me/link-course/${value.id}`).then(res => res)
}

export const doGetInteresses = async () => {
    return perf.get(`/interests`).then(res => res)
}

export const doHandleSave = async (nome_exibicao) => {
    return perf.patch(`/profiles/user/me`,{nome_exibicao})
}

export const doHandleTextFieldChange = async (field, value) => {
    return perf.post(`/profiles/user/me/link-interest/${value.id}`).then(res => res)
    
}

export const getProfiles =  async (query) => {
    return perf.get(`profiles`,query).then(res => res.data.items)
}