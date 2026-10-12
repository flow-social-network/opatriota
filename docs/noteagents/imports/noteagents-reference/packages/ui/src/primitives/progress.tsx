import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  "aria-valuemin"?: number;
  "aria-valuemax"?: number;
  "aria-valuenow"?: number;
}

export const Progress = ({
  value,
  max = 100,
  className,
  "aria-valuemin": ariaValuemin = 0,
  "aria-valuemax": ariaValuemax = 100,
  "aria-valuenow": ariaValuenow,
}: ProgressProps) => {
  const percent = (value / max) * 100;
  return (
    <div className="relative h-2 rounded-full bg-background overflow-hidden">
      <div
        className={cn(
          "h-full bg-primary rounded-full",
          `aria-valuemin="${ariaValuemin}" aria-valuemax="${ariaValuemax}"`,
          ariaValuenow !== undefined && `aria-valuenow="${ariaValuenow}"`,
          className,
        )}
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-label={`Progress: ${percent}%`}
      />
    </div>
  );
};