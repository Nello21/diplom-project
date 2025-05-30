export type IntegrationMethod = "euler" | "rk4" | "adams";

export type GraphicParameters = {
  ε: number;
  α: number;
  β: number;
  dt: number;
  x0: number;
  y0: number;
  z0: number;
  intTime: number;
  steps: number;
  method: IntegrationMethod;
};

export type IntegrationState = {
  x: number;
  y: number;
  z: number;
  prevDerivatives?: number[];
};

export type ZTrajectory = {
  xs: number[];
  ys: number[];
  zs: number[];
  color: string;
  lineWidth: number;
};
export type UTrajectory = {
  u1s: number[];
  u2s: number[];
  color: string;
  lineWidth: number;
};

export type systemParams = {
  ε: number;
  α: number;
  β: number;
  dt: number;
};
