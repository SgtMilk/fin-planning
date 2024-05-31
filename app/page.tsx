"use client";

import { BoxScroller, GraphScroller } from "@/components";
import { InputValueProvider, OptionProvider, useSaveContexts } from "@/data";
import { OptionsPanel } from "@/components/OptionsPanel";

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
      <BoxScroller />
      <div className="w-[calc(100vw-24.5rem)] h-full">
        <GraphScroller />
      </div>
      <OptionsPanel />
    </div>
  );
};
