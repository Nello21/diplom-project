import {
  IntegrationMethod,
  IntegrationState,
  GraphicParameters,
} from "../types";

export const integrate = (
  method: IntegrationMethod,
  state: IntegrationState,
  dt: number,
  ε: number,
  α: number,
  β: number
): IntegrationState => {
  const derivatives = (
    x: number,
    y: number,
    z: number
  ): [number, number, number] => {
    const dx = y;
    const dy = -(1 + z ** 2) * x + ε * (α - x ** 2) * y;
    const dz = ε * (x ** 2 - β * y ** 2);
    return [dx, dy, dz];
  };

  switch (method) {
    case "euler": {
      const [dxE, dyE, dzE] = derivatives(state.x, state.y, state.z);
      return {
        x: state.x + dxE * dt,
        y: state.y + dyE * dt,
        z: state.z + dzE * dt,
      };
    }

    case "rk4": {
      const k1 = derivatives(state.x, state.y, state.z);
      const k2 = derivatives(
        state.x + (k1[0] * dt) / 2,
        state.y + (k1[1] * dt) / 2,
        state.z + (k1[2] * dt) / 2
      );
      const k3 = derivatives(
        state.x + (k2[0] * dt) / 2,
        state.y + (k2[1] * dt) / 2,
        state.z + (k2[2] * dt) / 2
      );
      const k4 = derivatives(
        state.x + k3[0] * dt,
        state.y + k3[1] * dt,
        state.z + k3[2] * dt
      );

      return {
        x: state.x + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
        y: state.y + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
        z: state.z + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
      };
    }

    case "adams": {
      const [dx, dy, dz] = derivatives(state.x, state.y, state.z);

      if (!state.prevDerivatives) {
        return {
          x: state.x + dx * dt,
          y: state.y + dy * dt,
          z: state.z + dz * dt,
          prevDerivatives: [dx, dy, dz],
        };
      }

      const [prevDx, prevDy, prevDz] = state.prevDerivatives;

      const nextX = state.x + (dt / 2) * (3 * dx - prevDx);
      const nextY = state.y + (dt / 2) * (3 * dy - prevDy);
      const nextZ = state.z + (dt / 2) * (3 * dz - prevDz);

      return {
        x: nextX,
        y: nextY,
        z: nextZ,
        prevDerivatives: [dx, dy, dz],
      };
    }

    default:
      throw new Error("Unknown integration method");
  }
};

export const simulateVanDerPol = ({
  ε = 0.05,
  α = 1,
  β = 0.9,
  dt = 0.01,
  x0 = 1,
  y0 = 0,
  z0 = 0,
  steps = 10000,
  method = "euler",
}: GraphicParameters) => {
  console.log(steps);
  let state: IntegrationState = { x: x0, y: y0, z: z0 };
  const xs = [];
  const ys = [];
  const zs = [];

  for (let i = 0; i < steps; i++) {
    state = integrate(method, state, dt, ε, α, β);
    xs.push(state.x);
    ys.push(state.y);
    zs.push(state.z);
  }

  return { xs, ys, zs };
};
