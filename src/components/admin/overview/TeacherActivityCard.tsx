import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface TeacherActivityCardProps {
  teacherActivity: { name: string; count: number }[];
}

const TeacherActivityCard = ({ teacherActivity }: TeacherActivityCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-2 mb-4">
      <Users className="h-5 w-5 text-slate-600" />
      <h3 className="text-lg font-semibold text-slate-900">Teacher Activity</h3>
    </div>
    <div className="space-y-3">
      {teacherActivity.map((teacher, index) => (
        <div key={teacher.name} className="flex items-center justify-between py-2 border-b last:border-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">#{index + 1}</span>
            <span className="text-sm font-medium text-slate-900">{teacher.name}</span>
          </div>
          <span className="text-sm font-semibold text-slate-700">{teacher.count} submissions</span>
        </div>
      ))}
    </div>
  </Card>
);

export default TeacherActivityCard;