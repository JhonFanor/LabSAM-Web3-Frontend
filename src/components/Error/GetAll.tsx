import React from "react";

interface GetAllErrorProps {
  message?: string | null;
}

export const GetAllError: React.FC<GetAllErrorProps> = ({ message }) => {
  if (!message) return null;

  return <p className="get-error">{message}</p>;
};
