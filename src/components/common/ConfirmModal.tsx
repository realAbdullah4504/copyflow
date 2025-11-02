import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "../ui/loading-spinner";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  buttonTitle: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  isSubmitting?: boolean;
}

const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  buttonTitle,
  onConfirm,
  onCancel,
  variant = "default",
  isSubmitting,
}: ConfirmModalProps) => {
  const handleCancel = () => {
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant={variant}
            className={
              buttonTitle.toLowerCase() === "delete"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : ""
            }
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && <LoadingSpinner className="mr-2" />} {buttonTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
