import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { FlagType, StudentRecord } from '../../types';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { MaskedId } from '../../components/common/MaskedId';
import { formatDate } from '../../utils/formatters';

export const FlaggedCases: React.FC = () => {
  const { students, institutions, resolveFlaggedCase } = useAppStore();

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Flagged students
  const flaggedList = useMemo(() => {
    return students.filter((s) => {
      const isFlagged = s.status === 'Flagged' || s.status === 'NeedsCorrection';
      if (!isFlagged) return false;

      if (selectedType !== 'ALL' && s.flagType !== selectedType) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.fullName.toLowerCase().includes(q) ||
          s.apaarId.toLowerCase().includes(q) ||
          (s.flagReason && s.flagReason.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [students, selectedType, searchQuery]);

  const handleResolve = (s: StudentRecord) => {
    resolveFlaggedCase(s.id, 'Resolved via AICTE Flagged Cases Control Center');
    setSuccessToast(`Case resolved for ${s.fullName}. Status restored to Verified.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const getInstitutionName = (id: string) => {
    return institutions.find((i) => i.id === id)?.shortName || 'Institute';
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Enforcement & Compliance Operations
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            AICTE National Flagged Cases & Anomalies
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Central repository of all institutional admission violations, duplicate clusters, and identity discrepancies.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
          {flaggedList.length} Active Flagged Cases
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">{successToast}</p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flagged cases..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-purple-400 outline-hidden bg-slate-50/50"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-purple-400 outline-hidden font-medium"
          >
            <option value="ALL">All Violation Types</option>
            <option value="MissingId">Missing APAAR ID</option>
            <option value="DuplicateId">Duplicate Identifier</option>
            <option value="DataMismatch">Registry Data Mismatch</option>
            <option value="ExcessSeat">Excess Admission Breach</option>
          </select>
        </div>
      </div>

      {/* Flagged Cases Grid */}
      <div className="space-y-4">
        {flaggedList.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-3 transition-all hover:border-rose-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-rose-600 text-white rounded-md">
                    <AlertOctagon className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">{s.fullName}</h3>
                  <span className="text-xs font-mono text-slate-500">({s.email})</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Institution: <strong className="text-slate-800">{getInstitutionName(s.institutionId)}</strong> • Course: {s.courseId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  {s.flagType || 'Compliance Warning'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">DOB: {formatDate(s.dateOfBirth)}</span>
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl text-xs text-rose-900">
              <strong className="block mb-0.5">Identified Regulatory Breach:</strong>
              <p>{s.flagReason}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-slate-500">
                APAAR: <MaskedId apaarId={s.apaarId} studentId={s.id} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResolve(s)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve & Clear Flag</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {flaggedList.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-extrabold text-base text-slate-900">
              No Active Flagged Cases
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              All student admission records and seat quotas across monitored institutions are currently compliant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
