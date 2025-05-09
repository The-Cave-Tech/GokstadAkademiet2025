import React from "react";
import { Theme } from "@/styles/activityTheme";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center my-16">
      <div
        className="animate-spin rounded-full h-12 w-12"
        style={{
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: `${Theme.colors.divider}`,
          borderTopColor: Theme.colors.primary,
        }}
      ></div>
    </div>
  );
};
