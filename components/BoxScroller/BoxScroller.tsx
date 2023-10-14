import React, { useRef, useState } from "react";
import ConnectedDateValueBox from "../DateValueBox/ConnectedDateValueBox";
import { useInputValueContext } from "@/data";
import { SvgIcon } from "../Base";

const BoxScroller = () => {
  const { getTypes, addEmptyInputValue } = useInputValueContext();
  const sections = getTypes().sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "case" })
  );

  const newCategory = useRef<string>("");
  const addCategory = () => {
    if (newCategory.current == "") return;
    addEmptyInputValue(newCategory.current);
    const input = document.getElementById("newCategoryInput");
    if (input) (input as unknown as { value: string }).value = "";
    newCategory.current = "";
  };

  return (
    <div className="bg-slate-100">
      <div className="px-1 py-5 bg-slate-300">
        <form
          className="flex flex-row justify-between align-center w-96 px-6"
          onSubmit={(e: any) => e.preventDefault()}
        >
          <input
            className="bg-slate-50 border border-slate-300 text-slate-900 w-40 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:bg-slate-100"
            type="text"
            id="newCategoryInput"
            onChange={(e: any) => {
              newCategory.current = e.target.value;
            }}
          />
          <button
            className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded"
            onClick={addCategory}
          >
            Add Category
          </button>
        </form>
      </div>

      {sections.map((section) => (
        <BoxScrollerSection key={section} title={section} />
      ))}
    </div>
  );
};

interface BoxScrollerSectionProps {
  title: string;
}

const BoxScrollerSection = ({ title }: BoxScrollerSectionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { getInputValueKeysByType, addEmptyInputValue } =
    useInputValueContext();

  const keys = getInputValueKeysByType(title);

  // SVG HERPERS
  const caretIcon = () => {
    const props = {
      handleFunction: () => setIsOpen(!isOpen),
      component: [
        <path
          d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}
          key="caret icons"
        />,
      ],
    };
    return <SvgIcon {...props} />;
  };

  const addIcon = () => {
    const props = {
      handleFunction: () => addEmptyInputValue(title),
      component: [
        <line x1="12" y1="5" x2="12" y2="19" key="line1"></line>,
        <line x1="5" y1="12" x2="19" y2="12" key="line2"></line>,
      ],
    };
    return <SvgIcon {...props} />;
  };

  return (
    <div className="border border-slate-200">
      <div className="px-1 py-5 text-lg">
        <div className="flex flex-row justify-between w-96 px-6">
          {caretIcon()}
          <p>{title}</p>
          {addIcon()}
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
  );
};

export default BoxScroller;
