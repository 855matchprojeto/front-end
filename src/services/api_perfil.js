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

export const getProfiles =  async (data,page_size) => {

    // lista de ids de interesses, filtro
    let interests_in = [];
    data[0].forEach(element => interests_in.push(element.id));

    // lista de ids de cursos, filtro
    let courses_in = [];
    data[1].forEach(element => courses_in.push(element.id));

    // pesquisa, nomes de usuarios
    let pesquisa = data[2];

    let query_its = "";
    interests_in.forEach(element => query_its  += "interests_in=" + element + "&");

    let query_crs = "";
    courses_in.forEach(element => query_crs += "courses_in=" + element + "&");

    let query = query_its + query_crs;

    if (pesquisa.length === 0)
    {
        query = query.slice(0,query.length-1);
    }
    else
    {
        query += `display_name_ilike=${pesquisa}&page_size=${page_size}`;
    }

    return perf.get(`profiles?${query}`).then(res => res.data.items)
}

export const getProfilesGUID = async (guid) => {
    return perf.get(`profiles/${guid}`).then(res => res.data)
}