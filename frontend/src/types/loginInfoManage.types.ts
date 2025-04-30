// frontend/src/types/loginInfoManage.types.ts

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

export interface VerificationModalProps extends BaseModalProps {
  onVerify: (code: string) => Promise<void>;
  email?: string;
}

// User credentials data structure
export interface UserCredentials {
  username: string;
  email: string;
  password: string;
}

// Update payload structures
export interface UsernameUpdatePayload {
  type: "username";
  value: string;
}

export interface EmailUpdatePayload {
  type: "email";
  value: string;
  password: string;
}

export interface PasswordUpdatePayload {
  type: "password";
  currentPassword: string;
  newPassword: string;
}

export type UpdatePayload = UsernameUpdatePayload | EmailUpdatePayload | PasswordUpdatePayload;


export interface LoginInfoModalController {
  modalType: ModalType;
  showVerificationModal: boolean;
  setModalType: (type: ModalType) => void;
  setShowVerificationModal: (show: boolean) => void;
  handleUpdate: (payload: UpdatePayload) => Promise<void>;
  handleVerification: (code: string) => Promise<void>;
  pendingData: {
    type: "username" | "email" | null;
    value: string;
  };
}