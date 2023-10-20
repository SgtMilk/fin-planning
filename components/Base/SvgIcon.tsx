import React from "react";

export interface SvgIconProps {
  handleFunction: () => void;
  component: React.ReactNode;
}

export const CaretIcon = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
}) => {
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

export const XIcon = ({ deleteFunction }: { deleteFunction: () => void }) => {
  const props = {
    handleFunction: deleteFunction,
    component: [
      <circle cx="12" cy="12" r="10" key="circle"></circle>,
      <line x1="15" y1="9" x2="9" y2="15" key="x line 1"></line>,
      <line x1="9" y1="9" x2="15" y2="15" key="x line 2"></line>,
    ],
  };
  return <SvgIcon {...props} />;
};

export const AddIcon = ({ addFunction }: { addFunction: () => void }) => {
  const props = {
    handleFunction: addFunction,
    component: [
      <line x1="12" y1="5" x2="12" y2="19" key="line1"></line>,
      <line x1="5" y1="12" x2="19" y2="12" key="line2"></line>,
    ],
  };
  return <SvgIcon {...props} />;
};

export const EditIcon = ({
  isEdit,
  editFunction,
}: {
  isEdit: boolean;
  editFunction: () => void;
}) => {
  const props = {
    handleFunction: editFunction,
    component: [
      isEdit ? (
        <polyline points="20 6 9 17 4 12" key="check"></polyline>
      ) : (
        <polygon points="16,3 21,8 8,21 3,21 3,16 16,3" key="pencil"></polygon>
      ),
    ],
  };
  return <SvgIcon {...props} />;
};

export const SvgIcon = ({ handleFunction, component }: SvgIconProps) => (
  <button onClick={handleFunction}>
    <svg
      className="flex align-center justify-center w-5 h-5 dark:text-white stroke-slate-900"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {component}
    </svg>
  </button>
);
