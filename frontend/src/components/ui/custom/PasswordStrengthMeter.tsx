"use client";

import React from "react";
import { calculatePasswordStrength, getPasswordStrengthInfo } from "@/lib/validation/universalValidation";
import { PasswordStrengthMeterProps } from "@/types/universalPassword.types";

/**
 * En gjenbrukbar komponent som viser passordstyrke som en visuell måler
 * med valgfri tekstmerkelapp
 */
export function PasswordStrengthMeter({
  password,
  showLabel = true,
  className = "",
}: PasswordStrengthMeterProps): React.ReactNode {
  if (!password) return null;
  
  const strength = calculatePasswordStrength(password);
  const strengthInfo = getPasswordStrengthInfo(password);
  
  return (
    <div className={`space-y-1 ${className}`}>
      {/* Styrke-måler */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${strengthInfo.color}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      
      {/* Valgfri styrke-merkelapp */}
      {showLabel && (
        <p className="text-xs text-gray-600 flex justify-between">
          <span>Passordstyrke:</span>
          <span className={strengthInfo.textColor}>{strengthInfo.text}</span>
        </p>
      )}
    </div>
  );
}

export default PasswordStrengthMeter;