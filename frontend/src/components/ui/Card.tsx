// src/components/ui/Card.tsx
"use client";

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      {...props} 
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
  return (
    <div
      className={`mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardBody = ({ children, className, ...props }: CardBodyProps) => {
  return (
    <div
      className={`mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, ...props }: CardFooterProps) => {
  return (
    <div
      className={`mt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };