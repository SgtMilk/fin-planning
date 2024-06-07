import Cookies from "js-cookie";

export const getCurMonth = (monthOffset: number = 0) => {
  const curDate = new Date();
  const fullMonth = curDate.getMonth() + monthOffset;
  const year = Math.floor(fullMonth / 12) + curDate.getFullYear();
  const month = (fullMonth % 12) + 1;
  return `${year}-${month < 10 ? "0" : ""}${month}`;
};

export const getCookies = (page: string | null, name: string) => {
  if (typeof window === "undefined" || page === null) return {};

  const cookieStringValue = Cookies.get(page);

  if (!cookieStringValue) return {};

  const parsedCookies = JSON.parse(cookieStringValue);

  if (!parsedCookies || !parsedCookies[name]) return {};

  return parsedCookies[name];
};

export const setCookies = (page: string, name: string, value: object) => {
  if (typeof window === "undefined" || page === null) return {};

  const cookieStringValue = Cookies.get(page);
  if (!cookieStringValue) {
    Cookies.set(page, JSON.stringify({ [name]: value }));
    return;
  }
  const parsedCookies = JSON.parse(cookieStringValue);
  parsedCookies[name] = value;

  Cookies.set(page, JSON.stringify(parsedCookies));
};

export const deletePageCookies = (page: string) => {
  if (typeof window === "undefined" || page === null) return {};

  Cookies.remove(page);
};

export const getAllPages = () => {
  if (typeof window === "undefined") return [];
  return Object.keys(Cookies.get());
};
