import React from "react";
import type { ButtonProps } from './Button.types';
import  { ButtonVariant } from './Button.types';

import styles from "./Button.module.css";

export const Button: React.FC<ButtonProps> = React.memo(({
  children,
  variant = ButtonVariant.START,
  onClick,
  type = "button",
  ariaLabel,
}) => {
  console.log('Button')
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
});
