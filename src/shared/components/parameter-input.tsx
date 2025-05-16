import { memo, useEffect, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Undo2 } from "lucide-react";

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  resetKey?: number;
};

export const ParameterInput = memo(
  ({ label, value, minValue, resetKey, onChange }: Props) => {
    const [localValue, setLocalValue] = useState(value.toString());
    const [error, setError] = useState("");
    const [history, setHistory] = useState<number[]>([]);

    useEffect(() => {
      setLocalValue(value.toString());
      setError("");
      setHistory([]);
    }, [resetKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.trim();
      setLocalValue(raw);

      const numberRegex = /^-?\d+(\.\d+)?$/;

      if (raw === "") {
        setError("Поле не может быть пустым");
        return;
      }

      if (!numberRegex.test(raw)) {
        setError("Некорректный формат числа");
        return;
      }

      const parsed = parseFloat(raw);
      if (isNaN(parsed)) {
        setError("Не удалось преобразовать в число");
        return;
      }

      if (minValue !== undefined && parsed < minValue) {
        setError(`Значение не может быть меньше ${minValue}`);
        return;
      }

      setError("");
      setHistory((prev) => [...prev, value]);
      onChange(parsed);
    };

    const handleUndo = () => {
      if (history.length === 0) return;

      const lastValue = history[history.length - 1];
      setLocalValue(lastValue.toString());
      onChange(lastValue);
      setHistory((prev) => prev.slice(0, -1));
    };

    return (
      <div className="grid grid-cols-[5rem_minmax(auto,max-content)_2.25rem] items-start gap-2">
        <label htmlFor={label} className="select-none">
          {label}:
        </label>
        <div className="flex flex-col gap-2">
          <Input
            id={label}
            type="text"
            value={localValue}
            onChange={handleChange}
            className="max-w-[10rem]"
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          disabled={history.length === 0}
          className="cursor-pointer"
        >
          <Undo2 />
        </Button>
      </div>
    );
  }
);
