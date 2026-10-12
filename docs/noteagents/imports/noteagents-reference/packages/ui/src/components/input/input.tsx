import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline" | "underlined";
  asChild?: boolean;
}

const inputVariants = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.props.children : "input";
    const baseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const dataDisabled = "data-[state=disabled]:opacity-50 data-[state=disabled]:pointer-events-none";
    let variantClasses = "";

    if (variant === "outline") {
      variantClasses = "border-2 bg-transparent";
    } else if (variant === "underlined") {
      variantClasses = "border-b-2 border-b border-input bg-transparent px-0";
    } else {
      variantClasses = "";
    }

    return (
      <Comp
        ref={ref}
        className={cn(baseClasses, dataDisabled, variantClasses, className)}
        {...props}
      />
    );
  }
);
input.displayName = "Input";

export { InputProps };