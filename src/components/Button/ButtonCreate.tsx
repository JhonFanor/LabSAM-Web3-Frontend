import React from "react";
import "./ButtonCreate.css";

type ButtonCreateProps = {
    onClick: () => void;
    label: string;
};

export const ButtonCreate: React.FC<ButtonCreateProps> = ({ onClick, label }) => {
    return (
        <button onClick={onClick} className="button-create">
            {label}
        </button>
    );
};

