// CustomButton.tsx
import React from "react";

interface CustomButtonProps {
  color: string;
  size: number;
  styles?: string[];
  icon: React.ComponentType;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ color, size, icon: Icon, onClick, ...styles }) => (
  <button style={{ color, fontSize: size , ...styles}} onClick={onClick}>
    <Icon />
  </button>
);

export default CustomButton;
