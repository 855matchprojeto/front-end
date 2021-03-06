import { getToken } from "./auth";
import jwt_decode from "jwt-decode";

// cria um delay em ms
export const delay = ms => new Promise(res => setTimeout(res, ms));

// limita string em um tamanho fixo
export const limitString  = (str, size) => {
    if (str.length > size)
        return `${str.slice(0, size)}`;
    return str;
}

// simplifica snackbar 
export const enqueueMySnackBar = (snack, msg, type) => {
    snack(msg, {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        variant: type,
      });
};

// tema do usuario
export function setPrefMode(newMode)
{
  localStorage.setItem("COLOR_MODE", newMode);
};

export function getPrefMode()
{
    let mode = localStorage.getItem("COLOR_MODE");
    if(mode !== "light" && mode !== "dark")
      localStorage.setItem("COLOR_MODE", "light");

    return localStorage.getItem("COLOR_MODE");
};

// transforma imagem em Base64
export async function Base64(img) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsDataURL(img);

    reader.onload = () => {
      const res = reader.result;
      resolve(res);
    };
  });
}

// pega username e email de cadastro
export function getLoginData()
{return jwt_decode(getToken);}