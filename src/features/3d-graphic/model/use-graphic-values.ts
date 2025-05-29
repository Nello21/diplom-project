import { simulateVanDerPol } from "@/shared/functions/3d-van-der-pol";
import {
  GraphicParameters,
  IntegrationMethod,
  ZTrajectory,
} from "@/shared/types";
import { Data } from "plotly.js";
import { useState, useMemo } from "react";

type ValuesType = Omit<GraphicParameters, "method">;

const INTEGRATION_STEP_COUNT = 8000;

export const useGraphicValues = () => {
  const [integrationTime, setIntegrationTime] = useState<number>(
    INTEGRATION_STEP_COUNT * 0.001
  );

  const initialValues: ValuesType = {
    ε: 0.05,
    α: 1,
    β: 0.9,
    dt: 0.001,
    x0: 1,
    y0: 0,
    z0: 0,
  };

  //   const [isPending, startTransition] = useTransition();
  const [color, setColor] = useState<string>("#aabbcc");
  const [lineWidth, setLineWidth] = useState<string>("2");
  const [resetKey, setResetKey] = useState<number>(0);
  const [method, setMethod] = useState<IntegrationMethod>("euler");
  const [values, setValues] = useState<ValuesType>(initialValues);

  const [trajectories, setTrajectories] = useState<ZTrajectory[]>([]);

  const onChange = (key: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSetIntegrationTime = (value: number) => {
    setIntegrationTime(value);
    setValues((prev) => ({
      ...prev,
      dt: value / INTEGRATION_STEP_COUNT,
    }));
  };

  const handleChangeDt = (value: number) => {
    const newIntegrationTime = value * INTEGRATION_STEP_COUNT;
    setIntegrationTime(newIntegrationTime);
    setValues((prev) => ({
      ...prev,
      dt: value,
    }));
  };

  const resetValues = () => {
    setValues(initialValues);
    setTrajectories([]);
    setColor("#aabbcc");
    setLineWidth("2");
    setIntegrationTime(INTEGRATION_STEP_COUNT * 0.001);
    setResetKey((prev) => prev + 1);
  };

  const addTrajectory = () => {
    const newTrajectory = simulateVanDerPol({
      ...values,
      method,
    });

    setTrajectories((prev) => [
      ...prev,
      { ...newTrajectory, color, lineWidth: Number(lineWidth) },
    ]);

    const lastIndex = newTrajectory.xs.length - 1;
    if (lastIndex >= 0) {
      const newX0 = newTrajectory.xs[lastIndex];
      const newY0 = newTrajectory.ys[lastIndex];
      const newZ0 = newTrajectory.zs[lastIndex];

      setValues((prev) => ({
        ...prev,
        x0: newX0,
        y0: newY0,
        z0: newZ0,
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
      line: { width: trajectory.lineWidth, color: trajectory.color },
    }));
  }, [trajectories]);

  return {
    plotData,
    values,
    trajectories,
    method,
    color,
    lineWidth,
    resetKey,
    integrationTime,
    // isPending,
    handleSetIntegrationTime,
    handleChangeDt,
    setColor,
    setMethod,
    setLineWidth,
    onChange,
    resetValues,
    addTrajectory,
    removeAllTrajectories,
    removeLastTrajectory,
    removeTrajectory,
  };
};
