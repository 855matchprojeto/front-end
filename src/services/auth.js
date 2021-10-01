export const getToken = localStorage.getItem("TOKEN");
export const estaLogado = Boolean(getToken);

export function login(token)
{
    localStorage.setItem("TOKEN", token);
    window.location.href = "/home";
};

export function logout()
{
    localStorage.removeItem("TOKEN");
    window.location.href = "/";
};