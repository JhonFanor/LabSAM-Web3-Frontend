import React from "react";
import "./ButtonReturn.css";

interface ButtonReturnProps {
    onClick: () => void;
}

export const ButtonReturn: React.FC<ButtonReturnProps> = ({ onClick }) => {
    return (
        <button className="button-return" onClick={onClick}>
            Volver
        </button>
    );
};