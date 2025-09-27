import React from "react";
import { FaTimes } from "react-icons/fa";
import "./ButtonClose.css"; 

interface ButtonCloseProps {
    onClick: () => void;
}

export const ButtonClose: React.FC<ButtonCloseProps> = ({ onClick}) => (
    <button className={`button-close`} onClick={onClick}>
        <FaTimes />
    </button>
);

