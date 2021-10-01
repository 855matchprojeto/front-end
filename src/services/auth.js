export const getToken = () => localStorage.getItem("TOKEN");
export const estaLogado = getToken;

export const login = (token) => {localStorage.setItem("TOKEN", token)};
export const logout = () => {localStorage.removeItem("TOKEN")};

export default getToken;