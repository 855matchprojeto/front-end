import axios from "axios";

// chamadas de Authenticator
let urlAuth = "https://authenticator-match-projetos.herokuapp.com";
const auth = axios.create({ baseURL: urlAuth });

auth.interceptors.request.use(async (options) => {
  options.headers["Content-Type"] = "application/json";
  return options;
});

auth.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    throw error;
  }
);

export const Logar = async (dados) => {
  const config = {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  var frm = new FormData();
  frm.append("username", dados.username);
  frm.append("password", dados.password);

  return auth
    .post(`/users/token`, frm, config)
    .then((res) => res)
    .catch((err) => err);
};

export const Cadastrar = async (usuario) => {
  const JSONuser = {
    nome: `${usuario.nome} ${usuario.sobrenome}`,
    username: usuario.username,
    password: usuario.password,
    email: usuario.email,
  };

  return auth
    .post(`/users`, JSONuser)
    .then((res) => res)
    .catch((err) => console.log(err));
};

export const Email = async (user) => {
  return auth
    .post(`/users/send-email-verification-link/${user}`)
    .then((res) => res)
    .catch((err) => console.log(err));
};
