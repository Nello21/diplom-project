import { Loader2, LucideProps } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const FullContainerLoader = ({ className, ...props }: LucideProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex justify-center items-center animate-spin",
        className
      )}
    >
      <Loader2 {...props} />
    </div>
  );
};
