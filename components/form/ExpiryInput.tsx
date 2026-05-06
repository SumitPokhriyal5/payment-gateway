import { Input } from "@/components/ui/input";
import { FieldShell } from "./FieldShell";

interface ExpiryInputProps {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function ExpiryInput({
  value,
  error,
  disabled,
  onChange,
  onBlur,
}: ExpiryInputProps) {
  return (
    <FieldShell id="expiry" label="Expiry (MM/YY)" error={error}>
      {(props) => (
        <Input
          {...props}
          type="text"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          value={value}
          disabled={disabled}
          maxLength={5}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}
    </FieldShell>
  );
}
