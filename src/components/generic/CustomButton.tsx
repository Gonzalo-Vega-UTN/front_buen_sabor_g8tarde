// CustomButton.tsx
import React from "react";

interface CustomButtonProps {
  color: string;
  size: number;
  icon: React.ComponentType;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ color, size, icon: Icon, onClick }) => (
  <button style={{ color, fontSize: size }} onClick={onClick}>
    <Icon />
  </button>
);

export default CustomButton;
