"use client";

import React, { useRef, useState } from "react";
import { ConnectedDateValueBox } from "./DateValueBox/ConnectedDateValueBox";
import { InputValueTypes, useInputValueContext } from "@/data";
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

export const BoxScroller = ({ rawData }: { rawData: boolean }) => {
  const { getTypes, addEmptyInputValue } = useInputValueContext();

  if (!rawData)
    return (
      <div className="overflow-y-scroll no-scrollbar h-full">
        {["Income", "Expenses", "Investments"].map((section) => (
          <BoxScrollerSection
            key={section}
            title={section as InputValueTypes}
          />
        ))}
      </div>
    );

  const sections = getTypes().sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "case" })
  );

  const addCategory = (input: string) => {
    if (input == "") return;

    addEmptyInputValue(input);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <HeaderInput buttonName="Add Category" inputFunc={addCategory} />

      <div className="overflow-y-scroll no-scrollbar h-[calc(100%-5.5rem)]">
        {sections.map((section) => (
          <RawBoxScrollerSection key={section} title={section} />
        ))}
      </div>
    </DndProvider>
  );
};

const RawBoxScrollerSection = ({ title }: { title: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const titleRef = useRef<string>(title);
  const { getInputValueKeysByTitle, addEmptyInputValue, editSectionTitle } =
    useInputValueContext();

  const keys = getInputValueKeysByTitle(title);

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
                  <ConnectedDateValueBox id={key} fullInputs={true} />
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

const BoxScrollerSection = ({ title }: { title: InputValueTypes }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { getInputValueKeysByType, addEmptyInputValueByType } =
    useInputValueContext();

  const keys = getInputValueKeysByType(title);

  return (
    <SectionCard
      addDrop={
        isOpen
          ? keys.map((key) => (
              <div key={key}>
                <ConnectedDateValueBox id={key} fullInputs={false} />
              </div>
            ))
          : null
      }
    >
      <CaretIcon {...{ isOpen, setIsOpen }} />

      <div className="h-7 overflow-none">
        <p>{title}</p>
      </div>

      <AddIcon addFunction={() => addEmptyInputValueByType(title)} />
    </SectionCard>
  );
};
