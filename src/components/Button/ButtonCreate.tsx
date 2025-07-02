import React from "react";

type ButtonCreateProps = {
    onClick: () => void;
    label: string;
};

export const ButtonCreate: React.FC<ButtonCreateProps> = ({ onClick, label }) => {
    return (
      <button onClick={onClick} className="header__login__button">
        {label}
      </button>
    );
};

