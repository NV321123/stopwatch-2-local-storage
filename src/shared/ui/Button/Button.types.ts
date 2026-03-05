export enum ButtonVariant {
  START = 'start',
  PAUSE = 'pause',
  CLEAR = 'clear',
  DELETE = 'delete',
  ADD = 'add',
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
} 
