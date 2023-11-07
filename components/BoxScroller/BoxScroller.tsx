"use client";

import React, { useEffect, useRef, useState } from "react";
import { ConnectedDateValueBox } from "../DateValueBox/ConnectedDateValueBox";
import { useInputValueContext } from "@/data";
import { AddIcon, CaretIcon, DropTarget, EditIcon } from "../Base";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const BoxScroller = () => {
  const [ready, setReady] = useState<boolean>();
  const { getTypes, addEmptyInputValue } = useInputValueContext();
  const sections = getTypes().sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "case" })
  );

  const newCategory = useRef<string>("");

  const addCategory = () => {
    if (newCategory.current == "") return;

    addEmptyInputValue(newCategory.current);

    // clearing the input
    const input = document.getElementById("newCategoryInput");
    if (input) (input as unknown as { value: string }).value = "";
    newCategory.current = "";
  };

  useEffect(() => {
    if (!ready) setReady(true);
  });

  return (
    <div className="bg-slate-100 dark:bg-slate-900 h-full w-[24.5rem]">
      <DndProvider backend={HTML5Backend}>
        <div className="flex align-center justify-center px-1 py-5 bg-slate-300 dark:bg-slate-950 h-[5.5rem]">
          {ready ? (
            <form
              className="flex flex-row justify-between align-center w-96 px-6"
              onSubmit={(e: any) => e.preventDefault()}
            >
              <input
                className="bg-slate-50 border border-slate-300 text-slate-900 mr-6 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-900 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id="newCategoryInput"
                onChange={(e: any) => {
                  newCategory.current = e.target.value;
                }}
              />
              <button
                className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
                onClick={addCategory}
              >
                Add Category
              </button>
            </form>
          ) : (
            <p className="flex align-center justify-center font-bold text-lg m-auto">
              Loading...
            </p>
          )}
        </div>

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
      <div className="border border-slate-200 dark:border-slate-800">
        <div className="px-1 py-5 text-lg">
          <div className="flex flex-row justify-between w-96 px-6">
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
          </div>
        </div>
        {isOpen
          ? keys.map((key) => (
              <div key={key} className="p-1">
                <ConnectedDateValueBox id={key} />
              </div>
            ))
          : null}
      </div>
    </DropTarget>
  );
};
