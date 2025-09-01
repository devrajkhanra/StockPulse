
import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  let style = {};
  let variantClass = 'badge';
  if (variant === 'secondary') {
    style = { background: '#e0e7ff', color: '#3730a3' };
  } else if (variant === 'destructive') {
    style = { background: '#fee2e2', color: '#b91c1c' };
  } else if (variant === 'outline') {
    style = { background: 'transparent', color: '#222', border: '1px solid #e5e7eb' };
  }
  return (
    <div className={`${variantClass} ${className}`} style={style} {...props} />
  );
}

export { Badge }
