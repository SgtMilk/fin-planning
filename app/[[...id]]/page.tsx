"use client";

import {
  InputValueProvider,
  OptionProvider,
  useSaveContexts,
  useSaveOnUnload,
} from "@/data";
import { useState } from "react";
import dynamic from "next/dynamic";

const Menu = dynamic(() => import("../../components/Menu/Menu"), {
  ssr: false,
});

const GraphScroller = dynamic(
  () => import("../../components/GraphScroller/GraphScroller"),
  {
    ssr: false,
  }
);

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <InputValueProvider page={params.id ? params.id[0] : null}>
        <OptionProvider page={params.id ? params.id[0] : null}>
          <ProvidedHome />
        </OptionProvider>
      </InputValueProvider>
    </main>
  );
}

const ProvidedHome = () => {
  useSaveContexts();
  useSaveOnUnload();

  const [openInstructions, setOpenInstructions] = useState<boolean>(false);

  const menuProps = {
    openInstructions,
    setOpenInstructions: () => setOpenInstructions(!openInstructions),
  };

  return (
    <div className="h-screen w-full flex flex-row">
      <Menu {...menuProps} />
      <div className="w-[calc(100vw-24.5rem)] h-full">
        <GraphScroller openInstructions={openInstructions} />
      </div>
    </div>
  );
};
