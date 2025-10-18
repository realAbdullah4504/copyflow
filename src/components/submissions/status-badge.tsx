import { Badge } from '@/components/ui/badge';
import { SubmissionStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      label: 'To Do',
      className: 'bg-green-100 text-green-800 hover:bg-green-100'
    },
    printed: {
      label: 'Printed',
      className: 'bg-slate-100 text-slate-800 hover:bg-slate-100'
    },
    censored: {
      label: 'In Review',
      className: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
    },
    flagged: {
      label: 'Urgent',
      className: 'bg-red-100 text-red-800 hover:bg-red-100'
    }
  };

  const { label, className } = config[status];

  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {label}
    </Badge>
  );
}
