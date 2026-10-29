import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const PrototypeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useAccessibility();

  if (dismissed) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-1 px-4 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulated Prototype Mode Active</span>
        </div>
        <button
          onClick={() => setDismissed(false)}
          className="text-amber-800 underline hover:text-amber-950 font-semibold"
        >
          View Full Notice
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Prototype Notice" className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2 text-xs md:text-sm shadow-inner relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-white/20 rounded-full shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-200" />
          </span>
          <p className="font-medium leading-tight">
            <span className="font-bold tracking-wide uppercase bg-black/20 px-1.5 py-0.5 rounded text-[11px] mr-1.5 border border-white/20">
              Prototype Notice
            </span>
            {t('demoNotice')}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors shrink-0"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
