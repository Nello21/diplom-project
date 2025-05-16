import { useEffect, useMemo, useState, useTransition } from "react";
import Plot from "react-plotly.js";
import {
  computeTrajectory,
  systemParams,
  Trajectory,
} from "@/shared/functions/averaged-system";
import { ParameterInput } from "@/shared/components/parameter-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { FullContainerLoader } from "@/shared/components/full-container-loader";

export const PhasePortrait = () => {
  const [isPending, startTransition] = useTransition();
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const initialValues = {
    ε: 1,
    α: 1,
    β: 0.9,
    dt: 0.01,
    steps: 1000,
  };
  const [values, setValues] = useState<systemParams>(initialValues);
  const initialAxisSteps = { yStep: 0.1, xStep: 0.5 };
  const [axisSteps, setAxisSteps] = useState(initialAxisSteps);
  const [color, setColor] = useState("#aabbcc");
  const [resetKey, setResetKey] = useState(0);

  const resetValues = () => {
    setValues(initialValues);
    setAxisSteps(initialAxisSteps);
    setResetKey((prev) => prev + 1);
  };

  const onChange = (key: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const onAxisStepsChange = (key: string, value: number) => {
    setAxisSteps((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const MAX_POINTS = 500;

  const initialConditions = useMemo(() => {
    if (axisSteps.xStep < 0.05 || axisSteps.yStep < 0.05) return [];

    const points: number[][] = [];
    for (let x = 0; x <= 8; x += axisSteps.xStep) {
      for (let y = -1; y <= 1; y += axisSteps.yStep) {
        points.push([x, y]);
      }
    }
    return points.slice(0, MAX_POINTS);
  }, [axisSteps.xStep, axisSteps.yStep]);

  useEffect(() => {
    if (initialConditions.length === 0) {
      setTrajectories([]);
      return;
    }

    startTransition(() => {
      const trajs = initialConditions
        .map(([u1, u2]) => computeTrajectory(u1, u2, { ...values }))
        .filter((traj) => traj.x.length > 50);

      setTrajectories(trajs);
    });
  }, [values, initialConditions]);

  return (
    <div className="flex flex-col items-start md:items-center w-full h-full">
      <h1 className="text-xl font-semibold">Фазовый портрет системы</h1>
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
          {Object.entries(axisSteps).map(([key, value]) => (
            <ParameterInput
              minValue={0.05}
              key={key}
              label={key}
              value={value}
              resetKey={resetKey}
              onChange={(v) => onAxisStepsChange(key, v)}
            />
          ))}
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
        <div className="relative w-full md:w-[50%] h-full min-h-[600px]">
          {isPending ? (
            <FullContainerLoader />
          ) : (
            <Plot
              className="w-full h-full"
              data={trajectories.map((traj) => ({
                type: "scatter",
                mode: "lines",
                x: traj.x,
                y: traj.y,
                line: { width: 2, color: color },
              }))}
              layout={{
                title: "Фазовый портрет",
                autosize: true,
                height: 600,
                margin: { l: 40, r: 40, t: 40, b: 40 },
                xaxis: { title: "x" },
                yaxis: { title: "y" },
                showlegend: false,
              }}
              useResizeHandler
              config={{ displaylogo: false }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
