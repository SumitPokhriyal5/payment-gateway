import { Input } from "@/components/ui/input";
import { FieldShell } from "./FieldShell";

interface CardholderNameInputProps {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function CardholderNameInput({
  value,
  error,
  disabled,
  onChange,
  onBlur,
}: CardholderNameInputProps) {
  return (
    <FieldShell id="cardholderName" label="Cardholder Name" error={error}>
      {(props) => (
        <Input
          {...props}
          type="text"
          autoComplete="cc-name"
          placeholder="John Doe"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}
    </FieldShell>
  );
}
