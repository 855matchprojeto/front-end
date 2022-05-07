import axios from "axios";
import { getToken } from "./auth";

let urlNotifications = "https://notification-match-projetos.herokuapp.com";
const notifications = axios.create({ baseURL: urlNotifications });

notifications.interceptors.request.use(async (options) => {
  options.headers["Content-Type"] = "application/json";
  options.headers["Authorization"] = `Bearer ${getToken}`;
  return options;
});

notifications.interceptors.response.use(
  (res) => {
    return res;
  },

  (err) => {
    throw err;
  }
);

export const getNotifications = async (flag) => {
  return notifications
    .get(`/users/user/me/get-notifications?is_read=${flag}`)
    .then((res) => res)
    .catch((err) => err);
};

export const setNotificationsAsRead = async (notificationsId) => {
  return notifications
    .put(`/users/user/me/batch-read-notifications`, {
      id_notificacao_list: notificationsId,
    })
    .then((res) => res)
    .catch((err) => err);
};
