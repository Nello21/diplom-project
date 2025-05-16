import {
  simulateVanDerPol,
  VanDerPolParameters,
} from "@/shared/functions/3d-van-der-pol";
import { useEffect, useMemo, useState, useTransition } from "react";
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

export const VanDerPol3DPlot = () => {
  const initialValues = {
    ε: 0.05,
    α: 1,
    β: 0.9,
    steps: 8000,
    dt: 0.01,
    x0: 1,
    y0: 0,
    z0: 0,
  };

  const [values, setValues] = useState<VanDerPolParameters>(initialValues);
  const [color, setColor] = useState("#aabbcc");
  const [resetKey, setResetKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(simulateVanDerPol(initialValues));

  const resetValues = () => {
    setValues(initialValues);
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    startTransition(() => {
      const simulation = simulateVanDerPol(values);
      setResult(simulation);
    });
  }, [values]);

  const plotData: Data[] = useMemo(
    () => [
      {
        type: "scatter3d",
        mode: "lines",
        x: result.xs,
        y: result.ys,
        z: result.zs,
        line: { width: 2, color },
      },
    ],
    [result, color]
  );

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
            className="max-w-fit cursor-pointer"
          >
            Сбросить значения
          </Button>
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
                  zaxis: { title: "z" },
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
