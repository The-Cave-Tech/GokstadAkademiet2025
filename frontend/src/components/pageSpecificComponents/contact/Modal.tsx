// src/components/contact/Modal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { FaCheckCircle } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting and body scroll
  useEffect(() => {
    setIsMounted(true);

    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Close modal when clicking on the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render anything on the server
  if (!isMounted) return null;

  // Don't render if modal is closed
  if (!isOpen) return null;

  // Create portal only if we're mounted and modal is open
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        <div className="px-6 py-4">{children}</div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          {secondaryButtonText && (
            <Button
              variant="secondary"
              onClick={onSecondaryButtonClick || onClose}
              ariaLabel={secondaryButtonText}
            >
              {secondaryButtonText}
            </Button>
          )}

          {primaryButtonText && (
            <Button
              variant="primary"
              onClick={onPrimaryButtonClick || onClose}
              ariaLabel={primaryButtonText}
            >
              {primaryButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
