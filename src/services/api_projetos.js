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
    {
        return proj.get(`/projetos`,{ params: {id:dados}})
            .then(res => res)
            .catch(err => console.log(err))
    }
    else if (dados === "")
    {
        return proj.get(`/projetos`)
            .then(res => res)
            .catch(err => console.log(err))
    }
    else
    {
        return proj.get(`/projetos`,{ params: {titulo_ilike:dados}})
            .then(res => res)
            .catch(err => console.log(err))
    }
}

export const postProjetos = async (dados) => {
    return proj.post(`/projetos`,dados)
        .then(res => res)
}

export const updateProjetos = async (guid,form) => {
    return proj.put(`/projetos/${guid}`,form)
        .then(res => res)
        .catch(err => console.log(err))
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

export const doGetAllCourses = async () => {
    return proj.get(`/curso`)
        .then(res => res)
        .catch(err => console.log(err))
}

export const doGetAllInteresses = async () => {
    return proj.get(`/interesse`)
        .then(res => res)
        .catch(err => console.log(err))
}

// remove ou adiciona area ao projeto
export const doUpdateAreas = async (dados,flag) => {
    if(flag)
    {
        return proj.post(`/rel_projeto_interesse`, dados)
        .then(res => res)
        .catch(err => console.log(err))
    }
    else
    {
        return proj.delete(`/rel_projeto_interesse`, dados)
        .then(res => res)
        .catch(err => console.log(err))
    }
}

// remove ou adiciona curso ao projeto
export const doUpdateCourses = async (dados,flag) => {
    if(flag)
    {
        return proj.post(`/rel_projeto_curso`, dados)
        .then(res => res)
        .catch(err => console.log(err))
    }
    else
    {
        return proj.delete(`/rel_projeto_curso`, dados)
        .then(res => res)
        .catch(err => console.log(err))
    }
}