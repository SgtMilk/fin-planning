"use client";

import React, { useState } from "react";
import { BoxScroller } from "./BoxScroller";
import { OptionsPanel } from "./OptionsPanel";
import { useInputValueContext, useOptionContext } from "@/data";
import { TypeInput, XIcon } from "../Base";
import { deletePageCookies, getAllPages, setCookies } from "@/data/utils";
import { useRouter } from "next/navigation";

enum MenuState {
  ScreenSelector,
  Main,
  Options,
  Inputs,
}

const Menu = ({
  openInstructions,
  setOpenInstructions,
}: {
  openInstructions: boolean;
  setOpenInstructions: () => void;
}) => {
  const { isEmpty } = useInputValueContext();
  const { pageIsSet } = useOptionContext();

  const [menuState, setMenuState] = useState<MenuState>(
    pageIsSet() ? MenuState.Main : MenuState.ScreenSelector
  );

  const ChooseState = () => {
    const router = useRouter();

    switch (menuState) {
      case MenuState.ScreenSelector: {
        const pages = getAllPages();
        return (
          <div>
            <TypeInput
              buttonName="Add Page"
              inputFunc={(pageName: string) => {
                setCookies(pageName, "temp", {});
                router.push(`/${pageName}`);
              }}
            />
            {pages.map((name) => (
              <RouterButton key={name} pageID={name} />
            ))}
          </div>
        );
      }
      case MenuState.Main: {
        return (
          <div>
            <Button to={MenuState.Inputs} />
            <Button to={MenuState.Options} />
            {isEmpty() ? null : <InstructionsButton />}
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
    if (menuState === MenuState.ScreenSelector) return <div />;

    const returnState =
      menuState === MenuState.Main ? MenuState.ScreenSelector : MenuState.Main;

    return (
      <div className="flex justify-start items-center">
        <button
          className="flex justify-center items-center w-5 h-5 p-5 rounded-3xl bg-slate-600 text-white font-bold"
          onClick={() => setMenuState(returnState)}
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

  const RouterButton = ({ pageID }: { pageID: string }) => {
    const router = useRouter();
    const { saveInputValueContext } = useInputValueContext();
    const { saveOptionsContext } = useOptionContext();
    return (
      <div className="border border-slate-300 dark:border-slate-700 p-1">
        <div className="px-1 py-5 text-lg">
          <div className="flex flex-row justify-between w-96 px-6">
            <button
              className="h-7 overflow-none"
              onClick={() => {
                if (pageIsSet()) {
                  saveInputValueContext();
                  saveOptionsContext();
                }
                router.push(`/${pageID}`);
                setMenuState(MenuState.Main);
              }}
            >
              <p>{pageID}</p>
            </button>
            <XIcon
              deleteFunction={() => {
                deletePageCookies(pageID);
                router.push("/");
                router.refresh();
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const InstructionsButton = () => (
    <button
      className="border border-slate-300 dark:border-slate-700 p-1"
      onClick={() => setOpenInstructions()}
    >
      <div className="px-1 py-5 text-lg">
        <div className="flex flex-row justify-between w-96 px-6">
          <div className="h-7 overflow-none">
            <p>
              {openInstructions ? "Close Instructions" : "Open Instructions"}
            </p>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="bg-slate-100 dark:bg-slate-900 h-full w-[24.5rem]">
      <div
        className={`w-full h-20 flex justify-between px-5 items-center bg-cyan-700`}
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

export default Menu;
