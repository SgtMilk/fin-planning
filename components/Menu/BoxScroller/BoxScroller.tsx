"use client";

import React, { useRef, useState } from "react";
import { ConnectedDateValueBox } from "./DateValueBox/ConnectedDateValueBox";
import { useInputValueContext } from "@/data";
import {
  AddIcon,
  CaretIcon,
  DropTarget,
  EditIcon,
  HeaderInput,
  SectionCard,
} from "@/components/common";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const BoxScroller = () => {
  const { getTypes, addEmptyInputValue } = useInputValueContext();
  const sections = getTypes().sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "case" })
  );

  const addCategory = (input: string) => {
    if (input == "") return;

    addEmptyInputValue(input);
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <HeaderInput buttonName="Add Category" inputFunc={addCategory} />

        <div className="overflow-y-scroll no-scrollbar h-[calc(100%-5.5rem)]">
          {sections.map((section) => (
            <BoxScrollerSection key={section} title={section} />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

interface BoxScrollerSectionProps {
  title: string;
}

const BoxScrollerSection = ({ title }: BoxScrollerSectionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const titleRef = useRef<string>(title);
  const { getInputValueKeysByType, addEmptyInputValue, editSectionTitle } =
    useInputValueContext();

  const keys = getInputValueKeysByType(title);

  const editFunction = () => {
    setIsEdit(!isEdit);
    if (isEdit) editSectionTitle(title, titleRef.current);
  };

  return (
    <DropTarget type={title}>
      <SectionCard
        addDrop={
          isOpen
            ? keys.map((key) => (
                <div key={key}>
                  <ConnectedDateValueBox id={key} />
                </div>
              ))
            : null
        }
      >
        <div className="w-10">
          <CaretIcon {...{ isOpen, setIsOpen }} />
        </div>

        <form
          className="h-7 overflow-none"
          onSubmit={(e: any) => {
            editFunction();
            return e.preventDefault();
          }}
        >
          {isEdit ? (
            <input
              defaultValue={title}
              className="text-center"
              onChange={(e: any) => {
                titleRef.current = e.target.value;
              }}
            />
          ) : (
            <p>{title}</p>
          )}
        </form>

        <div className="flex flex-row">
          <div className={`pr-3${isEdit ? " mt-1" : ""}`}>
            <EditIcon isEdit={isEdit} editFunction={editFunction} />
          </div>
          <AddIcon addFunction={() => addEmptyInputValue(title)} />
        </div>
      </SectionCard>
    </DropTarget>
  );
};
