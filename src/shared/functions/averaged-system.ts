import { IntegrationMethod, GraphicParameters } from "../types";

export interface IntegrationState {
  u1: number;
  u2: number;
  prevDerivatives?: [number, number];
}

export const integrate = (
  method: IntegrationMethod,
  state: IntegrationState,
  dt: number,
  ε: number,
  α: number,
  β: number
): IntegrationState => {
  const derivatives = (u1: number, u2: number): [number, number] => {
    const denominator = Math.pow(1 + u2 ** 2, 1.5);
    const numerator = 1 - (1 + β) * u2 + u2 ** 2 - β * u2 ** 3;

    const du1 = ε * u1 * (α - (u1 * numerator) / (2 * denominator));
    const du2 = ((ε * u1) / Math.sqrt(1 + u2 ** 2)) * (1 - β - β * u2 ** 2);

    return [du1, du2];
  };

  switch (method) {
    case "euler": {
      const [du1, du2] = derivatives(state.u1, state.u2);
      return {
        u1: state.u1 + du1 * dt,
        u2: state.u2 + du2 * dt,
      };
    }

    case "rk4": {
      const k1 = derivatives(state.u1, state.u2);
      const k2 = derivatives(
        state.u1 + (k1[0] * dt) / 2,
        state.u2 + (k1[1] * dt) / 2
      );
      const k3 = derivatives(
        state.u1 + (k2[0] * dt) / 2,
        state.u2 + (k2[1] * dt) / 2
      );
      const k4 = derivatives(state.u1 + k3[0] * dt, state.u2 + k3[1] * dt);

      return {
        u1: state.u1 + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
        u2: state.u2 + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
      };
    }

    case "adams": {
      const [du1, du2] = derivatives(state.u1, state.u2);

      if (!state.prevDerivatives) {
        return {
          u1: state.u1 + du1 * dt,
          u2: state.u2 + du2 * dt,
          prevDerivatives: [du1, du2],
        };
      }

      const [prevDu1, prevDu2] = state.prevDerivatives;

      const nextU1 = state.u1 + (dt / 2) * (3 * du1 - prevDu1);
      const nextU2 = state.u2 + (dt / 2) * (3 * du2 - prevDu2);

      return {
        u1: nextU1,
        u2: nextU2,
        prevDerivatives: [du1, du2],
      };
    }

    default:
      throw new Error("Unknown integration method");
  }
};

export const computeTrajectory = ({
  ε = 0.05,
  α = 1,
  β = 0.9,
  dt = 0.01,
  x0 = 1, // u1
  y0 = 0, // u2
  method = "euler",
}: GraphicParameters) => {
  let state: IntegrationState = { u1: x0, u2: y0 };
  const u1s = [];
  const u2s = [];

  for (let i = 0; i < 8000; i++) {
    state = integrate(method, state, dt, ε, α, β);
    u1s.push(state.u1);
    u2s.push(state.u2);
  }

  return { u1s, u2s };
};
