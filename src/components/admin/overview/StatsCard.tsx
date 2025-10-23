import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  label: string;
  value: number;
}

const StatCard = ({ icon: Icon, iconBg, label, value }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-sm font-medium text-slate-600">{label}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  </Card>
);

export default StatCard;
