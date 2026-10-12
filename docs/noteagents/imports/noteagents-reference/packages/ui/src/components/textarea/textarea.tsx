import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaAttributes<HTMLTextAreaElement> {
  variant?: "default" | "outline" | "underlined";
  asChild?: boolean;
}

const textareaVariants = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.props.children : "textarea";
    const baseClasses = "flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none resize-none";
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
textarea.displayName = "Textarea";

export { TextareaProps };