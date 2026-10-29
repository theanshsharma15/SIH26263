import React from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { maskApaarId } from '../../utils/apaar';

interface MaskedIdProps {
  apaarId?: string;
  studentId: string;
  allowToggle?: boolean;
  className?: string;
}

export const MaskedId: React.FC<MaskedIdProps> = ({
  apaarId,
  studentId,
  allowToggle = true,
  className = '',
}) => {
  const { revealedApaars, toggleRevealApaar } = useAppStore();
  const isRevealed = !!revealedApaars[studentId];

  if (!apaarId || apaarId.trim() === '') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
        Missing APAAR
      </span>
    );
  }

  const displayText = isRevealed ? apaarId : maskApaarId(apaarId);

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-xs ${className}`}>
      <span
        className={`px-2 py-0.5 rounded tracking-wider border font-medium ${
          isRevealed
            ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
            : 'bg-slate-100 text-slate-800 border-slate-200'
        }`}
      >
        {displayText}
      </span>
      {allowToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleRevealApaar(studentId);
          }}
          title={isRevealed ? 'Mask APAAR (Audit Logged)' : 'Unmask APAAR (Audit Logged)'}
          aria-label={isRevealed ? 'Mask APAAR ID' : 'Unmask APAAR ID'}
          className="p-1 text-slate-500 hover:text-gov-navy-600 hover:bg-slate-200 rounded transition-colors"
        >
          {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      )}
      {isRevealed && (
        <span title="Action logged in AICTE Audit Trail" className="text-[10px] text-amber-700 flex items-center gap-0.5">
          <ShieldCheck className="w-3 h-3 text-amber-600" />
          <span className="hidden sm:inline">Logged</span>
        </span>
      )}
    </div>
  );
};
