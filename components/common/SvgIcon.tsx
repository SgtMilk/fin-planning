import React from "react";
import { isDarkMode } from ".";

export interface SvgIconProps {
  handleFunction?: () => void;
  component: React.ReactNode;
  isButton?: boolean;
  isDark?: boolean;
  size?: string;
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

export const MenuIcon = () => {
  const props = {
    handleFunction: () => {},
    component: [
      <line x1="3" y1="12" x2="21" y2="12" key="line-1"></line>,
      <line x1="3" y1="6" x2="21" y2="6" key="line-2"></line>,
      <line x1="3" y1="18" x2="21" y2="18" key="line-3"></line>,
    ],
    isButton: false,
    isDark: false,
  };
  return <SvgIcon {...props} />;
};

export const OptionsIcon = () => {
  const props = {
    handleFunction: () => {},
    component: [
      <circle cx="12" cy="12" r="3" key="circle"></circle>,
      <path
        key="path"
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>,
    ],
    isButton: false,
    size: "10",
  };
  return <SvgIcon {...props} />;
};

export const DragIcon = () => {
  const props = {
    handleFunction: () => {},
    component: [
      <path key="path" d="M5.2 9l-3 3 3 3M9 5.2l3-3 3 3M15 18.9l-3 3-3-3M18.9 9l3 3-3 3M3.3 12h17.4M12 3.2v17.6"/>
    ],
    isButton: false,
    isDark: true,
    size: "10",
  };
  return <SvgIcon {...props} />;
};

export const SvgIcon = ({
  handleFunction = () => {},
  component,
  isButton = true,
  isDark = !isDarkMode(),
  size = "24",
}: SvgIconProps) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isButton ? (
      <button onClick={handleFunction}>{children}</button>
    ) : (
      <div>{children}</div>
    );
  return (
    <Wrapper>
      <svg
        className={`flex align-center justify-center w-5 h-5 dark:text-white stroke-${
          isDark ? "slate-900" : "white"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox={`0 0 24 24`}
        fill="none"
        stroke={isDark ? "#0f172a" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {component}
      </svg>
    </Wrapper>
  );
};
