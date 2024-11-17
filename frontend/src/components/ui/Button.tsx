import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: String;
  onClick: () => void;
  startIcon: ReactElement;
}

export const Button = (props) => {
  return <div>Button</div>;
};
