import React, { useRef } from "react";
import { Input } from ".";

export interface HeaderInputProps {
  buttonName: string;
  inputFunc: (input: string) => void;
}

export const HeaderInput = ({ buttonName, inputFunc }: HeaderInputProps) => {
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
        <Input
          type="text"
          id={inputID}
          onChange={(e: any) => {
            input.current = e.target.value;
          }}
        />
        <div className="w-10" />
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
