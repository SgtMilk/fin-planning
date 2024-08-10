"use client";

import React, { useRef, useState } from "react";
import { ConnectedDateValueBox } from "./DateValueBox/ConnectedDateValueBox";
import {
  getDefaultInputValue,
  InputValueTypes,
  useInputValueContext,
} from "@/data";
import {
  AddIcon,
  Button,
  CaretIcon,
  DropTarget,
  EditIcon,
  HeaderInput,
  SectionCard,
} from "@/components/common";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { parseCSV } from "@/data/processCSV";

export const BoxScroller = ({ rawData }: { rawData: boolean }) => {
  const { getTypes, addEmptyInputValue, addInputValue } =
    useInputValueContext();

  if (!rawData) {
    const addBalance = () => {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";

      input.addEventListener("cancel", () => {
        console.log("Cancelled.");
      });
      input.addEventListener("change", async () => {
        if (!input.files || input.files.length != 1) {
          console.error("Wrong number of files, only one file is accepted.");
          return;
        }

        const parsedData = await parseCSV(input.files[0]);

        if (!parsedData) {
          console.error("Could not parse file");
          return;
        }

        ["Income", "Expenses"].forEach((type) => {
          const iv = getDefaultInputValue(type);
          iv["Title"] = `Monthly ${type}: ${new Date().toJSON().slice(0, 10)}`;
          iv["Contribution / Month"] =
            parsedData[type === "Income" ? "positive" : "negative"];
          iv["End Date"] = "2500-01";
          addInputValue(iv);
        });

        input.remove();
      });

      input.click();
    };

    return (
      <div className="overflow-y-scroll no-scrollbar h-full">
        <div className="w-full py-3.5 flex align-center justify-center bg-slate-300 dark:bg-slate-950">
          <Button buttonName="Add Balance from CSV" handleFunc={addBalance} />
        </div>
        {["Income", "Expenses", "Investments"].map((section) => (
          <BoxScrollerSection
            key={section}
            title={section as InputValueTypes}
          />
        ))}
      </div>
    );
  }

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
