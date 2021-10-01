const getToken = () => localStorage.getItem("TOKEN");
export const estaLogado = false;

export const login = (token) => {localStorage.setItem("TOKEN", token)};
export const logout = () => {localStorage.removeItem("TOKEN")};

export default getToken;