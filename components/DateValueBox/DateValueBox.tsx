import React, { useState } from "react";

export interface DateValueInputs {
  Title: string;
  "Current Value": number;
  "Start Date": string;
  "End Date": string;
}

export interface DateValueBoxProps {
  value: React.MutableRefObject<DateValueInputs>;
  deleteFunction: () => void;
}

export const DateValueBox = ({ value, deleteFunction }: DateValueBoxProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // the four inputs of the DateValueBox
  const inputs = [
    { label: "Title", type: "text" },
    { label: "Current Value", type: "number" },
    { label: "Start Date", type: "month" },
    { label: "End Date", type: "month" },
  ];

  // to update only a single value
  const updateValue = (key: string, newValue: string | number) => {
    value.current = { ...value.current, [key]: newValue };
  };

  // SVG HERPERS
  const caretIcon = () =>
    svgIcon("caret icon", () => setIsOpen(!isOpen), [
      <path
        d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}
        key="caret icons"
      />,
    ]);

  const xIcon = () =>
    svgIcon("x icon", deleteFunction, [
      <circle cx="12" cy="12" r="10" key="circle"></circle>,
      <line x1="15" y1="9" x2="9" y2="15" key="x line 1"></line>,
      <line x1="9" y1="9" x2="15" y2="15" key="x line 2"></line>,
    ]);

  const svgIcon = (
    key: string,
    handleFunction: () => void,
    component: Array<React.ReactElement>
  ) => (
    <button onClick={handleFunction} key={key}>
      <svg
        className="w-5 h-5 text-gray-800 dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {component}
      </svg>
    </button>
  );

  return (
    <div
      className={`${
        isOpen ? "grid grid-cols-2" : "flex flex-row justify-between"
      } gap-6 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 w-96`}
    >
      {caretIcon()}
      {isOpen ? null : <p>{value.current.Title}</p>}
      <div className="flex justify-end">{xIcon()}</div>

      {isOpen
        ? inputs.map(({ label, type }) =>
            type == "checkbox" ? (
              <div className="flex flex-row" key={label}>
                <div className="flex items-center">
                  <input className="w-4 h-4" type={type} />
                  <label className="block text-sm font-medium text-gray-900 dark:text-white pl-3">
                    {label}
                  </label>
                </div>
              </div>
            ) : (
              <div key={label}>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {label}
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:bg-gray-100"
                  type={type}
                  defaultValue={
                    (value.current as { [key: string]: any })[label]
                  }
                  onChange={(e: any) => updateValue(label, e.target.value)}
                />
              </div>
            )
          )
        : null}
    </div>
  );
};
