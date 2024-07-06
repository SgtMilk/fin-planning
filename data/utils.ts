export const getCurMonth = (monthOffset: number = 0) => {
  const curDate = new Date();
  const fullMonth = curDate.getMonth() + monthOffset;
  const year = Math.floor(fullMonth / 12) + curDate.getFullYear();
  const month = (fullMonth % 12) + 1;
  return `${year}-${month < 10 ? "0" : ""}${month}`;
};

export const transformToURL = (name:string) => {
  return encodeURIComponent(name)
}

export const transformFromURL = (url:string) => {
  return decodeURIComponent(url)
}

