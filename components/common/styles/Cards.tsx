import React, { ReactNode } from "react";

export const SectionCard = ({
  children,
  addDrop = null,
}: {
  children: ReactNode;
  addDrop?: ReactNode;
}) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800">
      <div className="px-1 py-5 text-lg">
        <div className="flex flex-row justify-between w-96 px-6 h-7 overflow-none">
          {children}
        </div>
      </div>
      {addDrop}
    </div>
  );
};

export const InfoCard = ({
  children,
  isGrid,
}: {
  children: ReactNode;
  isGrid: boolean;
}) => {
  return (
    <div
      className={`${
        isGrid ? "grid grid-cols-2" : "flex flex-row justify-between"
      } gap-6 p-6 bg-white border border-slate-200 rounded-lg shadow dark:bg-slate-800 dark:border-slate-700 w-96 m-1`}
    >
      {children}
    </div>
  );
};
