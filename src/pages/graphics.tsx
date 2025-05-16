import { PhasePortrait } from "@/features/2d-phase-portrait";
import { VanDerPol3DPlot } from "@/features/3d-van-der-pol";
import styles from "./graphics.module.css";

export const Graphics = () => {
  return (
    <div className={styles.container}>
      <VanDerPol3DPlot />
      <PhasePortrait />
    </div>
  );
};
