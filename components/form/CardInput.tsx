import { Input } from "@/components/ui/input";
import { FieldShell } from "./FieldShell";
import { CardBrandBadge } from "./CardBrandBadge";
import { detectCardType } from "@/utils/card";

interface CardInputProps {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function CardInput({
  value,
  error,
  disabled,
  onChange,
  onBlur,
}: CardInputProps) {
  const cardType = detectCardType(value);

  return (
    <FieldShell id="cardNumber" label="Card Number" error={error}>
      {(props) => (
        <div className="relative">
          <Input
            {...props}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={value}
            disabled={disabled}
            maxLength={19}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className="pr-16"
          />
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <CardBrandBadge type={cardType} />
          </div>
        </div>
      )}
    </FieldShell>
  );
}
