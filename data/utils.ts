import Cookies from "js-cookie";

export const getCurMonth = (monthOffset: number = 0) => {
  const curDate = new Date();
  const fullMonth = curDate.getMonth() + monthOffset;
  const year = Math.floor(fullMonth / 12) + curDate.getFullYear();
  const month = (fullMonth % 12) + 1;
  return `${year}-${month < 10 ? "0" : ""}${month}`;
};

export const getCookies = (name: string) => {
  if (typeof window === "undefined") return {};

  const cookieStringValue = Cookies.get(name);
  return cookieStringValue === undefined ? {} : JSON.parse(cookieStringValue);
};

export const setCookies = (name: string, value: object) => {
  Cookies.set(name, JSON.stringify(value));
};
