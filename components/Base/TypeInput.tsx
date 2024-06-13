import React, { useRef } from "react";

export interface TypeInputProps {
  buttonName: string;
  inputFunc: (input: string) => void;
}

export const TypeInput = ({ buttonName, inputFunc }: TypeInputProps) => {
  const input = useRef<string>("");

  const inputID = `input-${buttonName}`;

  const clearInput = () => {
    // clearing the input
    const inputElement = document.getElementById(inputID);
    if (inputElement) (inputElement as unknown as { value: string }).value = "";
    input.current = "";
  };

  return (
    <div className="flex align-center justify-center px-1 py-5 bg-slate-300 dark:bg-slate-950 h-[5.5rem]">
      <form
        className="flex flex-row justify-between align-center w-96 px-6"
        onSubmit={(e: any) => e.preventDefault()}
      >
        <input
          className="bg-slate-50 border border-slate-300 text-slate-900 mr-6 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-900 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          id={inputID}
          onChange={(e: any) => {
            input.current = e.target.value;
          }}
        />
        <button
          className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
          onClick={() => {
            if (!input.current || input.current === "") return;
            inputFunc(input.current);
            clearInput();
          }}
        >
          {buttonName}
        </button>
      </form>
    </div>
  );
};
