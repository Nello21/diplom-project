export type VanDerPolParameters = {
  ε: number;
  α: number;
  β: number;
  steps: number;
  dt: number;
  x0: number;
  y0: number;
  z0: number;
};

export const simulateVanDerPol = ({
  ε = 0.05,
  α = 1,
  β = 0.9,
  steps = 8000,
  dt = 0.01,
  x0 = 1,
  y0 = 0,
  z0 = 0,
}: VanDerPolParameters) => {
  let x = x0;
  let y = y0;
  let z = z0;

  const xs = [],
    ys = [],
    zs = [];

  for (let i = 0; i < steps; i++) {
    const dx = y;
    const dy = -(1 + z ** 2) * x + ε * (α - x ** 2) * y;
    const dz = ε * (x ** 2 - β * y ** 2);

    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    xs.push(x);
    ys.push(y);
    zs.push(z);
  }

  return { xs, ys, zs };
};
