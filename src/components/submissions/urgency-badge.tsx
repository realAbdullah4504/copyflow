import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';

interface UrgencyBadgeProps {
  urgency: 'low' | 'medium' | 'high';
}

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const config = {
    low: {
      label: 'Low',
      className: 'bg-slate-100 text-slate-700 hover:bg-slate-100'
    },
    medium: {
      label: 'Medium',
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    },
    high: {
      label: 'High',
      className: 'bg-red-100 text-red-800 hover:bg-red-100'
    }
  };

  const { label, className } = config[urgency];

  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {label}
    </Badge>
  );
}
