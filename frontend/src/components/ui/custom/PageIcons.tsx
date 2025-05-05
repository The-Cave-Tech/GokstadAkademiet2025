"use client";

import Image from "next/image";
import { useState } from "react";

type IconProps = {
  name: string;
  directory?: string;
  size?: number;
  alt?: string;
  className?: string;
  color?: string;
  isDecorative?: boolean;
};

export const PageIcons = ({
  name,
  directory = "profileicons", 
  size = 24,
  alt = "",
  className = "",
  color = "currentColor",
  isDecorative = false,
}: IconProps) => {
  // State to track if the image fails to load
  const [hasError, setHasError] = useState(false);

  // Construct the icon path
  const iconPath = `/${directory}/${name}.svg`;

  // Compute alt text: empty for decorative icons, otherwise use provided alt or default to name
  const computedAlt = isDecorative ? "" : alt || `${name} icon`;

  // Show fallback if there's an error
  if (hasError) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={`flex items-center justify-center text-gray-700 ${className}`}
        style={{ width: size, height: size, minWidth: 24, minHeight: 24 }}
      >
        Icon not available
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size, minWidth: 24, minHeight: 24 }}
    >
      <Image
        src={iconPath}
        alt={computedAlt}
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority={false}
        style={{ color }}
        onError={() => setHasError(true)} 
      />
    </div>
  );
};

export default PageIcons;