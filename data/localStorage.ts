import { useInputValueContext } from "./InputValueContext";
import { useOptionContext } from "./OptionsContext";

export const getStorage = (page: string | null, name: string) => {
    if (typeof window === "undefined" || page === null) return {};
  
    const storageStringValue = localStorage.getItem(page);
  
    if (!storageStringValue) return {};
  
    const parsedStorage = JSON.parse(storageStringValue);
  
    if (!parsedStorage || !parsedStorage[name]) return {};
  
    return parsedStorage[name];
  };
  
  export const setStorage = (page: string, name: string, value: object) => {
    if (typeof window === "undefined" || page === null) return {};
  
    const storageStringValue = localStorage.getItem(page);
    if (!storageStringValue) {
      localStorage.setItem(page, JSON.stringify({ [name]: value }));
      return;
    }
    const parsedStorage = JSON.parse(storageStringValue);
    parsedStorage[name] = value;
  
    localStorage.setItem(page, JSON.stringify(parsedStorage));
  };
  
  export const deletePageStorage = (page: string) => {
    if (typeof window === "undefined" || page === null) return {};
  
    localStorage.removeItem(page);
  };
  
  export const getAllPages = () => {
    if (typeof window === "undefined") return [];

    let {"ally-supports-cache": _, ...rest} = localStorage;
    return Object.keys(rest).sort();
  };

  export const useSavePage = () => {
    const { saveInputValueContext } = useInputValueContext();
    const { saveOptionsContext } = useOptionContext();
  
    return () => {
      saveInputValueContext();
      saveOptionsContext();
    }
  }
  
  export const useSaveOnUnload = () => {
    const savePage = useSavePage()
    const { getPageID } = useOptionContext();
    const page = getPageID();
  
    if (typeof window === "undefined") return;
  
    window.addEventListener("beforeunload", function (event) {
      if(!page) return;
      // check if deleted
      const storagePresent = localStorage.getItem(page);
      if(storagePresent) savePage()
    });
  };
  
  export const useSaveContexts = () => {
    const savePage = useSavePage()
  
    if (typeof document === "undefined") return;
  
    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.keyCode == 83 &&
          (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)
        ) {
          event.preventDefault();
          savePage();
        }
      },
      false
    );
  };