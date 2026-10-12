import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  variant?: "default" | "destructive" | "success" | "warning";
  className?: string;
  children: React.ReactNode;
}

const alertVariants = {
  default: "border-l-4 border-border bg-background",
  destructive: "border-l-4 border-destructive bg-destructive/10 text-destructive",
  success: "border-l-4 border-success bg-success/10 text-success",
  warning: "border-l-4 border-warning bg-warning/10 text-warning",
};

export const Alert = ({
  variant = "default",
  className,
  children,
}: AlertProps) => {
  return (
    <div className={cn("rounded-lg p-4", alertVariants[variant], className)}>
      {children}
    </div>
  );
};