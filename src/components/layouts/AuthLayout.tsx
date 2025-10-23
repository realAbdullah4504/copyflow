import { FileText } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Card, CardHeader} from "@/components/ui/card";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-10 w-10 text-slate-700" />
            <h1 className="text-3xl font-extrabold text-slate-900">CopyFlow</h1>
          </div>
        </CardHeader>
        <Outlet />
      </Card>
    </div>
  );
};

export default AuthLayout;
