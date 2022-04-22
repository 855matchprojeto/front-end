// cria um delay em ms
export const delay = ms => new Promise(res => setTimeout(res, ms));

// limita string em um tamanho fixo
export const limitString  = (str, size) => {
    if (str.length > size)
        return `${str.slice(0, size)}`;
    return str;
}