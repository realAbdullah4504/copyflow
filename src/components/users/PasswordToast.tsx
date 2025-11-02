import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PasswordToastProps {
  password: string;
}

export const showPasswordToast = ({ password }: PasswordToastProps) => {
  toast.success(
    <div className="space-y-2">
      <p>User created successfully!</p>
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
        <code className="text-sm">
          Temporary password: <span className="font-bold">{password}</span>
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(password);
            toast.success('Password copied to clipboard');
          }}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        This password will not be shown again. Please save it now.
      </p>
    </div>,
    { duration: 10000 }
  );
};
