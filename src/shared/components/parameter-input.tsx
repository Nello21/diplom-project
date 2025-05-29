import { memo, useEffect, useMemo, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Undo2 } from "lucide-react";
import { cn } from "../lib/utils";

type Props = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  addTrajectory: () => void;
  minValue?: number;
  resetKey?: number;
  backup?: boolean;
  className?: string;
  hideLabel?: boolean;
  isValidText?: boolean;
};

export const ParameterInput = memo(
  ({
    label,
    value,
    minValue,
    resetKey,
    onChange,
    backup,
    className,
    isValidText,
    addTrajectory,
  }: Props) => {
    const [localValue, setLocalValue] = useState(String(value));
    const [error, setError] = useState("");
    const [history, setHistory] = useState<number[]>([]);

    useEffect(() => {
      setLocalValue(String(value));
      setError("");
      setHistory([]);
    }, [value, resetKey]);

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

    const filteredHistory = useMemo(() => {
      const exist = new Set();
      return history.filter((item) => {
        if (item === 0) return false;
        const isExist = exist.has(item);

        if (!isExist) exist.add(item);

        return !isExist;
      });
    }, [history]);

    const handleUndo = () => {
      if (filteredHistory.length === 0) return;

      let lastValue = filteredHistory.pop();

      if (lastValue) {
        setLocalValue(lastValue.toString());
        onChange(lastValue);
        setHistory((prev) => prev.slice(0, -1));
        setError("");
      }
    };

    return (
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <Input
            id={label}
            type="text"
            value={localValue}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !error) return addTrajectory();
            }}
            className={cn(
              "max-w-[10rem]",
              {
                ["ring-destructive border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25"]:
                  error,
              },
              className
            )}
          />
          {isValidText && error && (
            <span className="text-red-500 text-sm">{error}</span>
          )}
        </div>
        {backup && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={!filteredHistory.length}
            className="cursor-pointer"
          >
            <Undo2 />
          </Button>
        )}
      </div>
    );
  }
);
