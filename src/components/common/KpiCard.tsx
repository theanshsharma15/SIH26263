import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  trend?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          border: 'border-emerald-200 hover:border-emerald-400',
          bg: 'bg-white',
          iconBg: 'bg-emerald-100 text-emerald-700',
          valueColor: 'text-slate-900',
        };
      case 'warning':
        return {
          border: 'border-amber-200 hover:border-amber-400',
          bg: 'bg-white',
          iconBg: 'bg-amber-100 text-amber-700',
          valueColor: 'text-amber-900',
        };
      case 'danger':
        return {
          border: 'border-rose-200 hover:border-rose-400',
          bg: 'bg-rose-50/30',
          iconBg: 'bg-rose-100 text-rose-700',
          valueColor: 'text-rose-900',
        };
      case 'info':
        return {
          border: 'border-blue-200 hover:border-blue-400',
          bg: 'bg-white',
          iconBg: 'bg-blue-100 text-blue-700',
          valueColor: 'text-slate-900',
        };
      default:
        return {
          border: 'border-slate-200 hover:border-gov-navy-300',
          bg: 'bg-white',
          iconBg: 'bg-gov-navy-50 text-gov-navy-600',
          valueColor: 'text-slate-900',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-5 shadow-sm transition-all duration-200 ${styles.bg} ${styles.border} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className={`text-2xl lg:text-3xl font-bold tracking-tight ${styles.valueColor}`}>{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>}
          {trend && (
            <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${styles.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
