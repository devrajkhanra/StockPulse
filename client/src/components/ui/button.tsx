
import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    let style: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 8,
      fontSize: '1em',
      fontWeight: 500,
      cursor: 'pointer',
      border: 'none',
      padding: '0.75em 2em',
      background: '#5b21b6',
      color: '#fff',
      transition: 'background 0.2s',
    };
    if (variant === 'destructive') {
      style.background = '#b91c1c';
    } else if (variant === 'outline') {
      style.background = 'transparent';
      style.color = '#222';
      style.border = '1px solid #e5e7eb';
    } else if (variant === 'secondary') {
      style.background = '#e0e7ff';
      style.color = '#3730a3';
    } else if (variant === 'ghost') {
      style.background = 'transparent';
      style.color = '#5b21b6';
    } else if (variant === 'link') {
      style.background = 'transparent';
      style.color = '#5b21b6';
      style.textDecoration = 'underline';
    }
    if (size === 'sm') {
      style.fontSize = '0.95em';
      style.padding = '0.5em 1.5em';
    } else if (size === 'lg') {
      style.fontSize = '1.1em';
      style.padding = '1em 2.5em';
    } else if (size === 'icon') {
      style.padding = '0.75em';
      style.width = 40;
      style.height = 40;
    }
    return (
      <button ref={ref} className={className} style={style} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button };
