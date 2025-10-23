import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface AttendanceCardProps {
  attendanceRate: number | string;
  totalPresent: number;
  totalStudents: number;
  absent: number;
  late: number;
}

const AttendanceCard = ({ attendanceRate, totalPresent, totalStudents, absent, late }: AttendanceCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-2 mb-4">
      <TrendingUp className="h-5 w-5 text-slate-600" />
      <h3 className="text-lg font-semibold text-slate-900">Attendance Overview</h3>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Today's Attendance Rate</span>
        <span className="text-2xl font-bold text-green-600">{attendanceRate}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Students Present</span>
        <span className="text-lg font-semibold">{totalPresent} / {totalStudents}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <div className="text-xs text-slate-600">Absent</div>
          <div className="text-xl font-bold text-red-600">{absent}</div>
        </div>
        <div>
          <div className="text-xs text-slate-600">Late</div>
          <div className="text-xl font-bold text-orange-600">{late}</div>
        </div>
      </div>
    </div>
  </Card>
);

export default AttendanceCard;