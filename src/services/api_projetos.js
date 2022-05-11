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
    return proj.post(`/projetos`, dados)
        .then(res => res)
        .catch(err => console.log(err))
}

export const updateProjetos = async (guid,form) => {
    return proj.put(`/projetos/${guid}`,form)
        .then(res => res)
        .catch(err => console.log(err))
}

export const getMeusProjetos = async () => {
    return proj.get(`/users/me/projects`)
        .then(res => res)
        .catch(err => console.log(err))
}

// chamada que retorna um grupo de usuarios
// guid_projeto: identificador do projeto atual

// fl_usuario_interesse:
// relacao de interesse: usuario => projeto
// fitra usuarios que possuem (ou nao possuem) interesse no projeto 

// fl_projeto_interesse:
// relacao de interesse: projeto => usuario
// fitra usuarios se forem (ou nao forem) de interesse do projeto
export const getProjUserRel = async (guid_projeto, fl_usuario_interesse, fl_projeto_interesse) => {

    let query = `/projects/${guid_projeto}/user-project-interest`;
    let first = true;

    if(fl_usuario_interesse != null)
    {
        query += `${first ? "?" : "&"}fl_usuario_interesse=${fl_usuario_interesse}`;
        if(first)
            first = false;
    }
    if(fl_projeto_interesse != null)
    {
        query += `${first ? "?" : "&"}fl_projeto_interesse=${fl_projeto_interesse}`;
        if(first)
            first = false;
    }
    
    return proj.get(query)
        .then(res => res)
        .catch(err => console.log(err))
}

// chamada que adiciona ou remove uma relacao de interesse, de acordo com os valores do body
// usuario => projeto 
// OU
// projeto => usuario
export const putRel = async (guid_usuario, guid_projeto, body) => {
    return proj.put(`/users/user/${guid_usuario}/project/${guid_projeto}/user-project-interest`, body)
            .then(res => res)
            .catch(err => console.log(err))
}

// chamada que retorna um grupo de projetos
// fl_usuario_interesse:
// relacao de interesse: usuario => projeto
// fitra projetos que possuem (ou nao possuem) interesse do usuario

// fl_projeto_interesse:
// relacao de interesse: projeto => usuario
// fitra projetos que possuem (ou nao possuem) interesse no usuario
export const getUserProjRel = async (fl_usuario_interesse, fl_projeto_interesse, fl_match) => {
    
    let query = '/users/me/projects/user-project-interest';
    let first = true;

    if(fl_usuario_interesse != null)
    {
        query += `${first ? "?" : "&"}fl_usuario_interesse=${fl_usuario_interesse}`;
        if(first)
            first = false;
    }
    if(fl_projeto_interesse != null)
    {
        query += `${first ? "?" : "&"}fl_projeto_interesse=${fl_projeto_interesse}`;
        if(first)
            first = false;
    }
    
    if(fl_match != null)
    {
        query += `${first ? "?" : "&"}fl_match=${fl_match}`;
        if(first)
            first = false;
    }

    return proj.get(query)
        .then(res => res)
        .catch(err => console.log(err))
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
        return proj.delete(`/rel_projeto_interesse`, { data: dados})
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
        return proj.delete(`/rel_projeto_curso`, { data: dados})
        .then(res => res)
        .catch(err => console.log(err))
    }
}