import { useDrag } from "react-dnd";

export const DragObject = ({
  children,
  itemID,
}: {
  children: React.ReactElement;
  itemID: string;
}) => {
  const [collected, dragRef] = useDrag(
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
    <div ref={dragRef} {...collected}>
      {children}
    </div>
  );
};
