interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const PageHeader = ({ title, actions }: PageHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
    {actions && <div>{actions}</div>}
  </div>
);

export default PageHeader;