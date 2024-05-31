"use client";

import { Menu, GraphScroller } from "@/components";
import { InputValueProvider, OptionProvider, useSaveContexts } from "@/data";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <InputValueProvider>
        <OptionProvider>
          <ProvidedHome />
        </OptionProvider>
      </InputValueProvider>
    </main>
  );
}

const ProvidedHome = () => {
  useSaveContexts();

  return (
    <div className="h-screen w-full flex flex-row">
      <Menu />
      <div className="w-[calc(100vw-24.5rem)] h-full">
        <GraphScroller />
      </div>
    </div>
  );
};
