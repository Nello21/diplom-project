export type Trajectory = { x: number[]; y: number[] };

export type systemParams = {
  ε: number;
  α: number;
  β: number;
  steps: number;
  dt: number;
};

export const computeTrajectory = (
  u1: number,
  u2: number,
  params: {
    α: number;
    β: number;
    ε: number;
    dt: number;
    steps: number;
  }
): Trajectory => {
  const trajectory: Trajectory = { x: [u1], y: [u2] };

  for (let i = 0; i < params.steps; i++) {
    const denominator = Math.pow(1 + u2 ** 2, 1.5);

    const numerator = 1 - (1 + params.β) * u2 + u2 ** 2 - params.β * u2 ** 3;
    const du1 =
      params.ε * u1 * (params.α - (u1 * numerator) / (2 * denominator));
    const du2 =
      ((params.ε * u1) / Math.sqrt(1 + u2 ** 2)) *
      (1 - params.β - params.β * u2 ** 2);

    const gradient = Math.hypot(du1, du2);
    const adaptiveDt = params.dt * (gradient > 1 ? 0.1 : 1);

    u1 += du1 * adaptiveDt;
    u2 += du2 * adaptiveDt;

    trajectory.x.push(u1);
    trajectory.y.push(u2);
  }

  trajectory.x = trajectory.x.map((x) => Math.max(0, Math.min(8, x)));
  trajectory.y = trajectory.y.map((y) => Math.max(-1, Math.min(1, y)));

  return trajectory;
};
