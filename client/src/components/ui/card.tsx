
import * as React from "react"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style = {}, ...props }, ref) => (
    <div
      ref={ref}
      className={`card ${className}`}
      style={style}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style = {}, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{ ...style, display: 'flex', flexDirection: 'column', gap: '0.5em', padding: '1.5em 1.5em 0 1.5em' }}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style = {}, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{ ...style, fontSize: '1.5em', fontWeight: 600, letterSpacing: '-0.01em' }}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style = {}, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{ ...style, fontSize: '1em', color: '#6b7280' }}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style = {}, ...props }, ref) => (
    <div ref={ref} className={className} style={{ ...style, padding: '1.5em' }} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', style = {}, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{ ...style, display: 'flex', alignItems: 'center', padding: '1.5em 1.5em 0 1.5em' }}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
