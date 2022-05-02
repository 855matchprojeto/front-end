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

//
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