import axios from "axios";
import getToken from "../services/auth";

let url = "https://authenticator-match-projetos.herokuapp.com";
// https://authenticator-match-projetos.herokuapp.com/docs#/

const API = axios.create({baseURL: url});


API.interceptors.request.use(async (options) => {
    options.headers["Content-Type"] = "application/json"
    //options.headers["X-Authorization"] = getToken
    return options
})

API.interceptors.response.use(
    res => { return res },
    error => {
        if(error.response.status === 403 || error.response.status === 401){
            window.location.href = "/"
        }
        throw error
    }
)

export const Cadastrar = async (usuario) => {

    const JSONuser = {
        nome: usuario.nome + " " + usuario.sobrenome,
        username: usuario.email,
        password: usuario.password,
        email: usuario.email
    }

    return API.post(url+"/users", JSONuser).then(res => res)
}

export const Logar = async (dados) => {

    const JSONlogin = { 
        username: dados.email, 
        password: dados.password 
    }

    console.log(JSONlogin)

    return API.post(url+"/users/token", JSONlogin).then(res => res)
}