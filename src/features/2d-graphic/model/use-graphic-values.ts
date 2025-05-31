import { computeTrajectory } from "@/shared/functions/averaged-system";
import {
  GraphicParameters,
  IntegrationMethod,
  UTrajectory,
} from "@/shared/types";
import { Data, PlotMouseEvent } from "plotly.js";
import { useState, useMemo } from "react";

type ValuesType = Omit<GraphicParameters, "method" | "steps" | "z0">;

export const useAveragedGraphicValues = () => {
  const initialValues: ValuesType = {
    ε: 0.05,
    α: 1,
    β: 0.9,
    dt: 0.001,
    intTime: 10,
    x0: 1,
    y0: 0,
  };

  //   const [isPending, startTransition] = useTransition();
  const [color, setColor] = useState<string>("#aabbcc");
  const [lineWidth, setLineWidth] = useState<string>("2");
  const [resetKey, setResetKey] = useState<number>(0);
  const [method, setMethod] = useState<IntegrationMethod>("euler");
  const [values, setValues] = useState<ValuesType>(initialValues);

  const [trajectories, setTrajectories] = useState<UTrajectory[]>([]);

  const onChange = (key: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetValues = () => {
    setValues(initialValues);
    setColor("#aabbcc");
    setLineWidth("2");
    setResetKey((prev) => prev + 1);
  };

  const resetInitParams = () => {
    setValues((prev) => ({
      ...prev,
      x0: initialValues.x0,
      y0: initialValues.y0,
    }));
    setResetKey((prev) => prev + 1);
  };

  const addTrajectory = () => {
    const newTrajectory = computeTrajectory({
      ...values,
      steps: Math.abs(values.intTime / values.dt),
      method,
    });

    setTrajectories((prev) => [
      ...prev,
      { ...newTrajectory, color, lineWidth: Number(lineWidth) },
    ]);

    const lastIndex = newTrajectory.u1s.length - 1;
    if (lastIndex >= 0) {
      const newU1 = newTrajectory.u1s[lastIndex];
      const newU2 = newTrajectory.u2s[lastIndex];

      setValues((prev) => ({
        ...prev,
        x0: newU1,
        y0: newU2,
      }));
    }
  };

  const removeTrajectory = (index: number) => {
    setTrajectories((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllTrajectories = () => {
    setTrajectories([]);
  };

  const removeLastTrajectory = () => {
    setTrajectories((prev) => prev.slice(0, -1));
  };

  const plotData: Data[] = useMemo(() => {
    if (trajectories.length === 0) {
      return [
        {
          type: "scatter",
          mode: "lines",
          x: [0],
          y: [0],
        },
      ];
    }

    return trajectories.map((trajectory) => ({
      type: "scatter",
      mode: "lines",
      x: trajectory.u1s,
      y: trajectory.u2s,
      line: { width: trajectory.lineWidth, color: trajectory.color },
    }));
  }, [trajectories]);

  const handlePlotClick = (e: PlotMouseEvent) => {
    if (e?.points?.length > 0) {
      const point = e.points[0];
      if (typeof point.x === "number" && typeof point.y === "number") {
        onChange("x0", point.x);
        onChange("y0", point.y);
      }
      console.log("Clicked point:", point);
    }
  };

  return {
    plotData,
    values,
    trajectories,
    method,
    color,
    lineWidth,
    resetKey,
    // isPending,
    handlePlotClick,
    setColor,
    setMethod,
    setLineWidth,
    onChange,
    resetValues,
    resetInitParams,
    addTrajectory,
    removeAllTrajectories,
    removeLastTrajectory,
    removeTrajectory,
  };
};
