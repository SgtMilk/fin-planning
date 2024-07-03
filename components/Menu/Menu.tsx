"use client";

import React, { useState } from "react";
import { BoxScroller } from "./BoxScroller";
import { OptionsPanel } from "./OptionsPanel";
import { useInputValueContext, useOptionContext } from "@/data";
import { HeaderInput, XIcon } from "../common";
import {
  deletePageCookies,
  getAllPages,
  setCookies,
  transformFromURL,
  transformToURL,
  useSavePage,
} from "@/data/utils";
import { useRouter } from "next/navigation";
import { SectionCard } from "../common/styles";

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
  const savePage = useSavePage();

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
            <HeaderInput
              buttonName="Add Page"
              inputFunc={(pageName: string) => {
                if (pageIsSet()) savePage();

                const url = transformToURL(pageName);
                setCookies(url, "temp", {});
                router.push(`/${url}`);
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
    <button onClick={() => setMenuState(to)}>
      <SectionCard>
        <p>{MenuState[to]}</p>
      </SectionCard>
    </button>
  );

  const RouterButton = ({ pageID }: { pageID: string }) => {
    const router = useRouter();
    return (
      <SectionCard>
        <button
          className="h-7 overflow-none"
          onClick={() => {
            if (pageIsSet()) savePage();

            router.push(`/${pageID}`);
            setMenuState(MenuState.Main);
          }}
        >
          <p>{transformFromURL(pageID)}</p>
        </button>
        <XIcon
          deleteFunction={() => {
            deletePageCookies(pageID);
            router.push("/");
            router.refresh();
          }}
        />
      </SectionCard>
    );
  };

  const InstructionsButton = () => (
    <button onClick={() => setOpenInstructions()}>
      <SectionCard>
        <p>{openInstructions ? "Close Instructions" : "Open Instructions"}</p>
      </SectionCard>
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
      <div className="w-full h-[calc(100vh-5rem)] overflow-scroll no-scrollbar">
        {ChooseState()}
      </div>
    </div>
  );
};

export default Menu;
