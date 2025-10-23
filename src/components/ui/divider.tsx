interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider = ({ label, className = "" }: DividerProps) => (
  <div className={`relative my-4 ${className}`}>
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-slate-300" />
    </div>
    {label && (
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-slate-500">{label}</span>
      </div>
    )}
  </div>
);
