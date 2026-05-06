import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FieldShell } from "./FieldShell";
import { CURRENCIES } from "@/utils/constants";
import type { Currency } from "@/types";

interface AmountInputProps {
  amount: string;
  currency: Currency;
  error?: string;
  disabled?: boolean;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: Currency) => void;
  onBlur: () => void;
}

export function AmountInput({
  amount,
  currency,
  error,
  disabled,
  onAmountChange,
  onCurrencyChange,
  onBlur,
}: AmountInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <FieldShell id="amount" label="Amount" error={error} className="flex-1">
          {(props) => (
            <Input
              {...props}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              disabled={disabled}
              onChange={(e) => onAmountChange(e.target.value)}
              onBlur={onBlur}
            />
          )}
        </FieldShell>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={currency}
            disabled={disabled}
            onValueChange={(value) => onCurrencyChange(value as Currency)}
          >
            <SelectTrigger id="currency" className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
