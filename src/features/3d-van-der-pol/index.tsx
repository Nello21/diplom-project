import { simulateVanDerPol } from "@/shared/functions/3d-van-der-pol";
import { useMemo, useState, useTransition } from "react";
import Plot from "react-plotly.js";
import { ParameterInput } from "../../shared/components/parameter-input";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Data } from "plotly.js";
import { FullContainerLoader } from "@/shared/components/full-container-loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  IntegrationMethod,
  GraphicParameters,
  ZTrajectory,
} from "@/shared/types";

type ValuesType = Omit<GraphicParameters, "method">;

export const VanDerPol3DPlot = () => {
  const initialValues: ValuesType = {
    ε: 0.05,
    α: 1,
    β: 0.9,
    dt: 0.001,
    x0: 0,
    y0: 0,
    z0: 0,
  };

  const [color, setColor] = useState("#aabbcc");
  const [resetKey, setResetKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [method, setMethod] = useState<IntegrationMethod>("euler");
  const [values, setValues] = useState<ValuesType>(initialValues);

  const [trajectories, setTrajectories] = useState<ZTrajectory[]>([]);

  const resetValues = () => {
    setValues(initialValues);
    setTrajectories([]);
    setResetKey((prev) => prev + 1);
  };

  const addTrajectory = () => {
    startTransition(() => {
      const newTrajectory = simulateVanDerPol({
        ...values,
        method,
      });
      setTrajectories((prev) => [...prev, { ...newTrajectory, color }]);
    });
  };

  const removeTrajectory = (index: number) => {
    setTrajectories((prev) => prev.filter((_, i) => i !== index));
  };

  const plotData: Data[] = useMemo(() => {
    if (trajectories.length === 0) {
      return [
        {
          type: "scatter3d",
          mode: "lines",
          x: [1],
          y: [1],
          z: [1],
        },
      ];
    }

    return trajectories.map((trajectory) => ({
      type: "scatter3d",
      mode: "lines",
      x: trajectory.xs,
      y: trajectory.ys,
      z: trajectory.zs,
      line: { width: 2, color: trajectory.color },
    }));
  }, [trajectories]);

  const onChange = (key: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h1 className="text-xl font-semibold">
        Предельный цикл системы типа Ван дер Поля
      </h1>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full h-full">
        <div className="flex flex-col gap-2 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetValues}
            className="max-w-fit"
          >
            Сбросить значения
          </Button>

          <div className="flex flex-col gap-2">
            <Select
              value={method}
              onValueChange={(value) => setMethod(value as IntegrationMethod)}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Методы счета" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="euler">Метод Эйлера</SelectItem>
                <SelectItem value="rk4">Рунге-Кутта 4-го порядка</SelectItem>
                <SelectItem value="adams">Метод Адамса</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(v) =>
                onChange(
                  "dt",
                  Math.abs(values.dt) * (v === "backward" ? -1 : 1)
                )
              }
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Направление времени" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forward">Вперёд</SelectItem>
                <SelectItem value="backward">Назад</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {Object.entries(values).map(([key, value]) => (
            <ParameterInput
              key={key}
              label={key}
              value={value}
              resetKey={resetKey}
              onChange={(v) => onChange(key, v)}
            />
          ))}

          <div className="grid grid-cols-[5rem_minmax(auto,max-content)] items-start gap-2">
            <span>цвет:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="cursor-pointer">Выбрать цвет</Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 border-0" asChild>
                <HexColorPicker color={color} onChange={setColor} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Поля для начальных условий */}
          <div className="mt-4 border-t pt-4">
            <Button onClick={addTrajectory} className="mt-2">
              Добавить траекторию
            </Button>
          </div>

          {/* Список траекторий с возможностью удаления */}
          {trajectories.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-medium mb-2">Траектории:</h3>
              <div className="pr-4 max-h-60 overflow-y-auto">
                {trajectories.map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1"
                  >
                    <span>Траектория {index}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTrajectory(index)}
                      className="hover:cursor-pointer hover:opacity-90"
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative w-full md:w-[50%] min-h-[619px] h-full">
          {isPending ? (
            <FullContainerLoader />
          ) : (
            <Plot
              className="w-full min-w-[375px] min-h-[619px] h-full"
              data={plotData}
              layout={{
                title: "Предельный цикл",
                autosize: true,
                scene: {
                  xaxis: { title: "x" },
                  yaxis: { title: "y" },
                  zaxis: { title: "z", range: [-1, 1] },
                },
              }}
              config={{ displaylogo: false }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
