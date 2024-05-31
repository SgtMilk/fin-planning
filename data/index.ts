import { useInputValueContext } from "./InputValueContext";
import { useOptionContext } from "./OptionsContext";

export * from "./InputValueContext";
export * from "./OptionsContext";

export const useSaveContexts = () => {
  const { saveInputValueContext } = useInputValueContext();
  const { saveOptionsContext } = useOptionContext();

  if (typeof document === "undefined") return;

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.keyCode == 83 &&
        (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)
      ) {
        event.preventDefault();
        saveInputValueContext();
        saveOptionsContext();
      }
    },
    false
  );
};
