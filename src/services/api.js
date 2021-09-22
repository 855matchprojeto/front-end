import axios from "axios";

let url = "https://authenticator-match-projetos.herokuapp.com";


const API = axios.create({baseURL: url});

API.interceptors.request.use(async (options) => {
    options.headers["Content-Type"] = "application/json"
    return options
})

API.interceptors.response.use(
    response => { return response },
    error => {
        if(error.response.status === 403 || error.response.status === 401){
            window.location.href = "/"
        }
        throw error
    }
)

export const Cadastrar = (dados) => {
    API.post(url+"/users", dados)
        .then(res => {
        console.log(res);
    })
}