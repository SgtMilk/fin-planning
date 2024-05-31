import React, { useState } from "react";
import { BoxScroller } from "./BoxScroller";
import { OptionsPanel } from "./OptionsPanel";

enum MenuState {
  Main,
  Options,
  Inputs,
}

export const Menu = () => {
  const [menuState, setMenuState] = useState<MenuState>(MenuState.Main);

  const ChooseState = () => {
    switch (menuState) {
      case MenuState.Main: {
        return (
          <div>
            <Button to={MenuState.Inputs} />
            <Button to={MenuState.Options} />
          </div>
        );
      }
      case MenuState.Options: {
        return <OptionsPanel />;
      }
      case MenuState.Inputs: {
        return <BoxScroller />;
      }
    }
  };

  const ReturnButton = () => {
    return menuState === MenuState.Main ? null : (
      <div className="flex justify-start items-center">
        <button
          className="flex justify-center items-center w-5 h-5 p-5 rounded-3xl bg-slate-600 text-white font-bold"
          onClick={() => setMenuState(MenuState.Main)}
        >
          {"<"}
        </button>
      </div>
    );
  };

  const Button = ({ to }: { to: MenuState }) => (
    <button
      className="border border-slate-300 dark:border-slate-700 p-1"
      onClick={() => setMenuState(to)}
    >
      <div className="px-1 py-5 text-lg">
        <div className="flex flex-row justify-between w-96 px-6">
          <div className="h-7 overflow-none">
            <p>{MenuState[to]}</p>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="bg-slate-100 dark:bg-slate-900 h-full w-[24.5rem]">
      <div
        className={`w-full h-20 flex justify-${
          menuState === MenuState.Main ? "end" : "between"
        } px-5 items-center bg-cyan-700`}
      >
        <ReturnButton />
        <p className="text-2xl text-white">Fin-Planning</p>
      </div>
      <div className="w-full h-[calc(100vh-5rem)] overflow-scroll">
        {ChooseState()}
      </div>
    </div>
  );
};
