"use client";

import { Menu, GraphScroller } from "@/components";
import {
  InputValueProvider,
  OptionProvider,
  useAddNotice,
  useSaveContexts,
} from "@/data";
import { useState } from "react";

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
  useAddNotice();

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
