"use client";

import { createContext, useContext } from "react";
import { ConnectDragSource, useDrag } from "react-dnd";

export const DragRefContext = createContext<null|ConnectDragSource>(null);
export const useDragRefContext = () => {
  return useContext(DragRefContext);
};

export const DragObject = ({
  children,
  itemID,
}: {
  children: React.ReactElement;
  itemID: string;
}) => {
  const [collected, dragRef, dragPreview] = useDrag(
    () => ({
      type: "card",
      item: { itemID },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );

  return (
    <div ref={dragPreview} {...collected}>
      <DragRefContext.Provider value={dragRef}>{children}</DragRefContext.Provider>
    </div>
  );
};
