import axios from "axios";
import { getToken } from "./auth";

// chamadas de Authenticator
let urlAuth = "https://authenticator-match-projetos.herokuapp.com";
const auth = axios.create({baseURL: urlAuth});

auth.interceptors.request.use(async (options) => {
    options.headers["Content-Type"] = "application/json"
    return options
})

auth.interceptors.response.use(
    res => { return res },
    error => {
        throw error
    }
)

export const Logar = async (dados) => {
    const config = {
        headers: { 
            'content-type': 'application/x-www-form-urlencoded',
        }
    }

    var frm = new FormData();
    frm.append('username', dados.username);
    frm.append('password', dados.password);

    return auth.post(`/users/token`,frm, config).then(res => res)
}

export const Cadastrar = async (usuario) => {
    const JSONuser = {
        nome:  `${usuario.nome} ${usuario.sobrenome}`,
        username: usuario.username,
        password: usuario.password,
        email: usuario.email
    }

    return auth.post(`/users`, JSONuser).then(res => res)
}

export const Email = async (user) => {
    return auth.post(`/users/send-email-verification-link/${user}`).then(res => res)
}

// chamadas de Perfil
let urlPerfil = "https://perfis-match-projetos.herokuapp.com";
const perf = axios.create({baseURL: urlPerfil});

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

export const Projetos = async (dados) => {
    return proj.get(`/projetos`).then(res => res)
}