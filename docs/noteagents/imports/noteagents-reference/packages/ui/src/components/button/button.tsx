import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const buttonVariants = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.props.children : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          "group bg-primary text-primary-foreground hover:bg-primary/90",
          "data-[state=disabled]:opacity-50 data-[state=disabled]:pointer-events-none",
          variant === "default"
            ? "hover:bg-primary/80"
            : variant === "destructive"
            ? "hover:bg-destructive/90"
            : variant === "outline"
            ? "border border-input hover:bg-accent hover:text-accent-foreground"
            : variant === "secondary"
            ? "bg-secondary hover:bg-secondary/80"
            : variant === "ghost"
            ? "hover:bg-accent/20"
            : variant === "link"
            ? "underline-offset-4 hover:underline text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            : "",
          size === "sm" && "h-8 rounded-md py-1",
          size === "lg" && "h-10 rounded-md py-2",
          size === "icon" && "h-10 w-10",
          className,
        )}
        {...props}
      />
    );
  }
);
button.displayName = "Button";

export { ButtonProps };