import { Button } from "@/components/ui/button";

interface DemoAccountButtonProps {
  email: string;
  name: string;
  role: string;
  onClick: (email: string) => void;
}

export const DemoAccountButton = ({
  email,
  name,
  role,
  onClick,
}: DemoAccountButtonProps) => (
  <Button
    variant="outline"
    onClick={() => onClick(email)}
    className="justify-start cursor-pointer w-full"
    type="button"
  >
    <div className="text-left">
      <div className="font-medium">{name}</div>
      <div className="text-xs text-slate-500">{role} Account</div>
    </div>
  </Button>
);
