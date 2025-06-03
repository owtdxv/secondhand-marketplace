export interface LoginProps {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  isLoginButtonEnabled: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: () => void;
  onNaverLogin: () => void;
}

export interface SignupProps {
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  passwordMatch: boolean;
  passwordValid: boolean;
  emailCheckResult: boolean | null;
  nameCheckResult: boolean | null;
  errorMessage: string;
  isSignupButtonDisabled: boolean;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDisplayNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheckEmailDuplicate: () => Promise<void>;
  onCheckNameDuplicate: () => Promise<void>;
  onSignup: () => Promise<void>;
}
