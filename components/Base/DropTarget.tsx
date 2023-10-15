"use client";

import { useInputValueContext } from "@/data";
import { useDrop } from "react-dnd";

export const DropTarget = ({
  children,
  type,
}: {
  children: React.ReactElement;
  type: string;
}) => {
  const { modifyInputValue } = useInputValueContext();

  const [_, drop] = useDrop(() => ({
    accept: "card",
    drop: (monitor: any) => modifyInputValue(monitor.itemID, "Type", type),
  }));

  return <div ref={drop}>{children}</div>;
};
