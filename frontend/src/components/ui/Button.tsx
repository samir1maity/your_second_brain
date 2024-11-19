import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: String;
  onClick: () => void;
  startIcon: ReactElement;
}

const defaultColor = {
  primary: "text-white bg-purple-600",
  secondary: "text-purple-200 bg-purple-300",
};

const defaultStyle = "";

export const Button = (props: ButtonProps) => {
  return <button className="">{props.text}</button>;
};
