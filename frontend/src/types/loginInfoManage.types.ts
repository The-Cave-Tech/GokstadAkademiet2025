// frontend/src/types/loginInfoManage.types.ts

export interface UsernameFormData {
  newUsername: string;
  currentPassword: string;
  verificationCode?: string;
}

export interface EmailFormData {
  newEmail: string;
  currentPassword: string;
  verificationCode?: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ModalType = "username" | "email" | "password" | null;
export type ModalStep = "input" | "verification";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export interface UsernameModalProps extends BaseModalProps {
  currentUsername: string;
  onUpdate: (newUsername: string, password: string) => Promise<void>;
}

export interface EmailModalProps extends BaseModalProps {
  currentEmail: string;
  onUpdate: (newEmail: string, password: string) => Promise<void>;
}

export interface PasswordModalProps extends BaseModalProps {
  onUpdate: (currentPassword: string, newPassword: string) => Promise<void>;
}



export interface UserCredentials {
  username: string;
  email: string;
  password: string;
}

export interface VerificationModalProps extends BaseModalProps {
  onVerify: (code: string) => Promise<void>;
  email?: string;
  onResendCode?: () => Promise<boolean | void>; 
}