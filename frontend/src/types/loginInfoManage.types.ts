export interface UsernameFormData {
    newUsername: string;
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
    onUpdate: (newUsername: string) => Promise<void>;
  }
  
  export interface EmailModalProps extends BaseModalProps {
    currentEmail: string;
    onUpdate: (newEmail: string) => Promise<void>;
  }
  
  export interface PasswordModalProps extends BaseModalProps {
    onUpdate: () => Promise<void>;
  }
  
  // User credentials data structure
  export interface UserCredentials {
    username: string;
    email: string;
    password: string;
  }