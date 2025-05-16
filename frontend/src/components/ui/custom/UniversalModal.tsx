//
"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import PageIcons from "@/components/ui/custom/PageIcons";

export interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  error?: string;
  successMessage?: string;
  modalWidth?: string;
}

export function UniversalModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  error, 
  successMessage,
  modalWidth = "max-w-[600px]"
}: UniversalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center overflow-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} className={`w-full ${modalWidth} mx-4 my-8`}>
        <Card className="w-full shadow-xl rounded-lg border">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">{title}</h2>
          </CardHeader>
          
          <CardBody className="px-6 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start"
                role="alert" aria-live="assertive">
                <PageIcons name="warning" directory="profileIcons" size={20} alt="" className="mt-0.5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start"
                role="alert" aria-live="assertive">
                <span>{successMessage}</span>
              </div>
            )}
            
            {children}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}