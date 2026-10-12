import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "secondary" | "outline" | "ghost";
}

const badgeVariants = React.forwardRef<HTMLButtonElement, BadgeProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.props.children : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-sm border border-2 border-transparent bg-primary px-3 py-1.5 text-xs font-medium ring-offset-background text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1",
          variant === "destructive"
            ? "border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/20"
            : variant === "secondary"
            ? "border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100"
            : variant === "outline"
            ? "border-primary text-primary hover:bg-primary/10"
            : variant === "ghost"
            ? "hover:bg-primary/10"
            : "",
          className,
        )}
        {...props}
      />
    );
  }
);
badge.displayName = "Badge";

export { BadgeProps };