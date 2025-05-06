import React from "react";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div
      className="text-center p-4 rounded-md"
      style={{
        backgroundColor: "rgba(168, 77, 70, 0.1)",
        color: "rgb(168, 77, 70)",
        border: `1px solid rgb(168, 77, 70)`,
      }}
    >
      {message}
    </div>
  );
};
