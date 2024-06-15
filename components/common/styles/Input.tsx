import React from "react";

export const Input = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const inputProps = {
    ...props,
    className:
      "bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
  };
  return <input {...inputProps} />;
};

export const InputWithLabel = ({
  label,
  inputProps,
}: {
  label: string;
  inputProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}) => {
  return (
    <div key={label} className="w-full">
      <label
        htmlFor={label}
        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
      >
        {label}
      </label>
      <Input {...inputProps} id={label} />
    </div>
  );
};

export const CheckboxInput = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const inputProps = {
    ...props,
    type: "checkbox",
    className: "w-4 h-4",
  };
  return <input {...inputProps} />;
};

export const CheckboxInputWithLabel = ({
  label,
  inputProps,
}: {
  label: string;
  inputProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}) => {
  return (
    <div className="flex flex-row" key={label}>
      <div className="flex items-center">
        <CheckboxInput {...inputProps} id={label} />
        <label
          htmlFor={label}
          className="block text-sm font-medium text-slate-900 dark:text-white pl-3"
        >
          {label}
        </label>
      </div>
    </div>
  );
};
