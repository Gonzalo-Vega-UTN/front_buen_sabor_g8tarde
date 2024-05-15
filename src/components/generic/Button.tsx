import React, { ReactNode } from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  color: string;
  icon: IconType;
  onClick: () => void;
  size?: number;
  text?: string;
  classes?: string;
}

const CustomButton: React.FC<ButtonProps> = ({ color, icon: Icon, onClick, size = 20, text = "", classes = "" }) => {
  return (
    <button className={classes}
      style={{ backgroundColor: color, padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
      onClick={onClick}
    >
      {Icon && <Icon size={size} />}
      {" " + text + " "}
    </button>
  )
}

export default CustomButton;