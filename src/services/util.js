// cria um delay em ms
export const delay = ms => new Promise(res => setTimeout(res, ms));

// divide um array grupos
export const chunk = (arr, tam) => Array.from({length: Math.ceil(arr.length / tam)}, (v, i) => arr.slice(i*tam, i*tam + tam));

// limita string em um tamanho fixo
export const limitString  = (str, size) => {
    if (str.length > size)
        return `${str.slice(0, size)}`;
    return str;
}