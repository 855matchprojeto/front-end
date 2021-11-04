import axios from "axios";

let url = "https://authenticator-match-projetos.herokuapp.com";
const API = axios.create({baseURL: url});

API.interceptors.request.use(async (options) => {
    options.headers["Content-Type"] = "application/json"
    return options
})

API.interceptors.response.use(
    res => { return res },
    error => {
        throw error
    }
)

export const Logar = async (dados) => {
    const config = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }

    var frm = new FormData();
    frm.append('username', dados.username);
    frm.append('password', dados.password);

    return API.post(`/users/token`,frm, config).then(res => res)
}

export const Cadastrar = async (usuario) => {
    const JSONuser = {
        nome:  `${usuario.nome} ${usuario.sobrenome}`,
        username: usuario.username,
        password: usuario.password,
        email: usuario.email
    }

    return API.post(`/users`, JSONuser).then(res => res)
}

export const Email = async (user) => {
    return API.post(`/users/send-email-verification-link/${user}`).then(res => res)
}