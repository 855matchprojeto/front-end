import axios from "axios";
import { getToken } from "./auth";
import { logout } from "./auth";

// chamadas de Perfil
let urlPerfil = "https://perfis-match-projetos.herokuapp.com";
const perf = axios.create({ baseURL: urlPerfil });

perf.interceptors.request.use(async (options) => {
  options.headers["Content-Type"] = "application/json";
  options.headers["Authorization"] = `Bearer ${getToken}`;
  return options;
});

perf.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response.status === 403 || error.response.status === 401) {
      logout();
    }
    throw error;
  }
);

// remove ou adiciona interesse ao perfil
export const doUpdateInteresse = async (id, flag) => {
  if (flag) {
    return perf
      .post(`/profiles/user/me/link-interest/${id}`)
      .then((res) => res)
      .catch((err) => err);
  } else {
    return perf
      .delete(`/profiles/user/me/link-interest/${id}`)
      .then((res) => res)
      .catch((err) => err);
  }
};

// remove ou adiciona curso ao perfil
export const doUpdateCourses = async (id, flag) => {
  if (flag) {
    return perf
      .post(`/profiles/user/me/link-course/${id}`)
      .then((res) => res)
      .catch((err) => err);
  } else {
    return perf
      .delete(`/profiles/user/me/link-course/${id}`)
      .then((res) => res)
      .catch((err) => console.log(err));
  }
};

// atualiza outras informacoes do perfil
export const doSaveProfile = async (user) => {
  return perf
    .patch(`/profiles/user/me`, user)
    .then((res) => res)
    .catch((err) => console.log(err));
};

// retorna informacoes do perfil
export const doGetDataUser = async () => {
  return perf
    .get(`/profiles/user/me`)
    .then((res) => res)
    .catch((err) => console.log(err));
};

// retorna cursos do perfil
export const doGetAllCourses = async () => {
  return perf
    .get(`/courses`)
    .then((res) => res)
    .catch((err) => console.log(err));
};

// retorna interesses do perfil
export const doGetAllInteresses = async () => {
  return perf
    .get(`/interests`)
    .then((res) => res)
    .catch((err) => console.log(err));
};

// retorna todos os perfis
export const getProfiles = async (data, page_size) => {
  let interests_in = data[0].map(el => el.id);
  let courses_in = data[1].map(el => el.id);
  let query = `/profiles?display_name_ilike=${data[2]}&page_size=${page_size}`;

  if (interests_in.length > 0)
  interests_in.forEach(el => {query += `&interests_in=${el}`});

  if (courses_in.length > 0)
    courses_in.forEach(el => {query += `&courses_in=${el}`});

  if (data.length === 4)
    query += `&cursor=${data[3]}`;

  return perf.get(query)
    .then((res) => res)
    .catch((err) => console.log(err));
};

export const getProfilesGUID = async (guid) => {
  return perf.get(`profiles/${guid}`).then((res) => res);
};

export const getProfileByGuidUser = async (guid) => {
  return perf
    .get(`/profiles/user/find-user-by-guid/${guid}`)
    .then((res) => res);
};

// chamada para adicionar um telefone de contato
export const postPhones = async (body) => {
  return perf
    .post(`profiles/user/me/perfil-phone`, body)
    .then((res) => res)
    .catch((err) => console.log(err));
};

// chamada para remover um telefone de contato
export const deletePhones = async (guid_perfil_phone) => {
  return perf
    .delete(`/profiles/user/me/perfil-phone/${guid_perfil_phone}`)
    .then((res) => res)
    .catch((err) => console.log(err));
};

// chamada para adicionar um email de contato
export const postEmail = async (body) => {
  return perf
    .post(`profiles/user/me/perfil-email`, body)
    .then((res) => res)
    .catch((err) => console.log(err));
};

// chamada para remover um email de contato
export const deleteEmail = async (guid_perfil_email) => {
  return perf
    .delete(`/profiles/user/me/perfil-email/${guid_perfil_email}`)
    .then((res) => res)
    .catch((err) => console.log(err));
};
