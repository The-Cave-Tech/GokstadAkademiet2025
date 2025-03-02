"use client";

const AuthCard = ({ header, content, footer, className = "" }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {header && <div className="mb-4">{header}</div>}
      <div className="mb-4">{content}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default AuthCard;