import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}

export function FieldShell({
  id,
  label,
  error,
  className,
  children,
}: FieldShellProps) {
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </Label>
      {children({
        id,
        "aria-invalid": hasError,
        "aria-describedby": hasError ? errorId : undefined,
      })}
      {hasError ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm leading-tight text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
