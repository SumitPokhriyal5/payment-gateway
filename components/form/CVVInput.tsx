import { Input } from "@/components/ui/input";
import { FieldShell } from "./FieldShell";
import { detectCardType } from "@/utils/card";
import { CVV_LENGTHS } from "@/utils/constants";

interface CVVInputProps {
  value: string;
  cardNumber: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function CVVInput({
  value,
  cardNumber,
  error,
  disabled,
  onChange,
  onBlur,
}: CVVInputProps) {
  const cardType = detectCardType(cardNumber);
  const maxLength = CVV_LENGTHS[cardType];

  return (
    <FieldShell id="cvv" label="CVV" error={error}>
      {(props) => (
        <Input
          {...props}
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder={cardType === "amex" ? "1234" : "123"}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}
    </FieldShell>
  );
}
