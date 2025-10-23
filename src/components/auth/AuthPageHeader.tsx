import { CardTitle, CardDescription } from "@/components/ui/card";

interface AuthPageHeaderProps {
  title: string;
  description?: string;
}

const AuthPageHeader = ({
  title,
  description,
}: AuthPageHeaderProps) => {
  return (
    <div className="text-center">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription className="text-slate-600">
        {description}
      </CardDescription>
    </div>
  );
};

export default AuthPageHeader;
