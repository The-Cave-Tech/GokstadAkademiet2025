// src/types/accountAdministration.types.ts

export interface AccountDeletionModalProps {
    isOpen: boolean;
    currentEmail: string;
    onClose: () => void;
    onVerify: (password: string) => Promise<void>;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
  }
  
  export interface AccountEmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (verificationCode: string, deletionReason?: string) => Promise<void>;
    email: string;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    deletionReason: string;
    setDeletionReason: (reason: string) => void;
  }
  
  export interface AccountAdministrationProps {
    userEmail?: string;
  }
  
  export interface AccountDeletionResponse {
    success: boolean;
    message: string;
  }

  export interface AccountEmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (verificationCode: string, deletionReason?: string) => Promise<void>;
    email: string;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    deletionReason: string;
    setDeletionReason: (reason: string) => void;
    onResendCode?: () => Promise<boolean | void>
  }