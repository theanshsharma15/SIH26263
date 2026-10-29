import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface StatusBadgeProps {
  status: VerificationStatus | 'Matched' | 'Discrepancy' | 'Unlinked' | 'Compliant' | 'Warning' | 'ExcessEnrolment' | 'Requested' | 'UnderReview' | 'Updated' | 'Rejected' | 'Normal' | 'NearCapacity' | 'ExcessAdmissions' | 'Unverified';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, className = '' }) => {
  switch (status) {
    case 'Verified':
    case 'Matched':
    case 'Compliant':
    case 'Updated':
    case 'Normal':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 ${className}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          <span>{status === 'Updated' ? 'Approved & Synced' : status}</span>
        </span>
      );

    case 'Pending':
    case 'Requested':
    case 'UnderReview':
    case 'NearCapacity':
    case 'Warning':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 ${className}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          <span>{status === 'NearCapacity' ? 'Near Capacity (≤2 seats)' : status}</span>
        </span>
      );

    case 'NeedsCorrection':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 ${className}`}
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
          <span>Needs Correction</span>
        </span>
      );

    case 'Flagged':
    case 'Discrepancy':
    case 'ExcessEnrolment':
    case 'ExcessAdmissions':
    case 'Rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 ${className}`}
        >
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
          <span>{status === 'ExcessAdmissions' ? 'Excess Admissions!' : status}</span>
        </span>
      );

    case 'Unlinked':
    case 'Unverified':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 ${className}`}
        >
          {showIcon && <XCircle className="w-3.5 h-3.5 text-slate-500" />}
          <span>{status}</span>
        </span>
      );
  }
};
