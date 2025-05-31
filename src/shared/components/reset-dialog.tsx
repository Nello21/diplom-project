import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export const ResetDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger className="hidden"></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подвердить сброс?</DialogTitle>
          <DialogDescription>
            Вы поменяли параметры системы, желаете начать сначала?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-center">
          <Button variant="secondary" onClick={() => (onSubmit(), onClose())}>
            Да
          </Button>
          <Button onClick={onClose}>Нет</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
