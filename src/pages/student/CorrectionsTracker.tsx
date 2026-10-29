import React from 'react';
import {
  FileEdit,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  FileText,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

export const CorrectionsTracker: React.FC = () => {
  const { currentUser, corrections, students, institutions } = useAppStore();
  const currentStudent = students.find((s) => s.apaarId === currentUser?.apaarId) || students[0];
  const institution = institutions.find((i) => i.id === currentStudent?.institutionId);

  const studentCorrections = corrections.filter((c) => c.studentId === currentStudent.id);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Grievance & Rectification Lifecycle
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Student Correction Request Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track multi-step institutional verification for student identity and academic rectification requests.
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {studentCorrections.map((req) => {
          const isUpdated = req.status === 'Updated';
          const isRejected = req.status === 'Rejected';
          const isRequested = req.status === 'Requested';

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Request #{req.id}: Rectify {req.fieldToCorrect}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned to: <strong className="text-slate-800">{institution?.name}</strong> • Submitted: {formatDateTime(req.createdAt)}
                  </p>
                </div>

                <StatusBadge status={req.status} />
              </div>

              {/* 4-Step Visual Stepper */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {/* Step 1 */}
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-900 text-[11px]">1. Requested</p>
                  <span className="text-[10px] text-emerald-700 block">Submitted online</span>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-900 text-[11px]">2. Reviewing</p>
                  <span className="text-[10px] text-emerald-700 block">Registrar queue</span>
                </div>

                {/* Step 3 */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isUpdated
                    ? 'bg-emerald-50 border-emerald-300'
                    : isRejected
                    ? 'bg-rose-50 border-rose-300'
                    : 'bg-amber-50 border-amber-300'
                }`}>
                  {isUpdated ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                  ) : isRejected ? (
                    <XCircle className="w-4 h-4 text-rose-600 mx-auto" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600 mx-auto" />
                  )}
                  <p className="font-bold text-slate-900 text-[11px]">3. Decision</p>
                  <span className={`text-[10px] font-bold block ${
                    isUpdated ? 'text-emerald-700' : isRejected ? 'text-rose-700' : 'text-amber-700'
                  }`}>
                    {isUpdated ? 'Approved' : isRejected ? 'Rejected' : 'Under Review'}
                  </span>
                </div>

                {/* Step 4 */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isUpdated
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 mx-auto ${isUpdated ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <p className="font-bold text-slate-900 text-[11px]">4. Re-Verified</p>
                  <span className="text-[10px] text-slate-500 block">
                    {isUpdated ? 'Central Record Synced' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Comparison details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Previous Erroneous Entry</span>
                  <span className="font-mono text-rose-700 font-semibold line-through mt-0.5 block">{req.currentValue}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Requested True Value</span>
                  <span className="font-mono text-emerald-700 font-bold mt-0.5 block">{req.requestedValue}</span>
                </div>
              </div>

              {/* Institution Remarks if present */}
              {req.institutionRemarks && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
                  <span className="font-bold block text-[11px]">Registrar Official Resolution Note:</span>
                  <p className="mt-0.5">{req.institutionRemarks}</p>
                </div>
              )}
            </div>
          );
        })}

        {studentCorrections.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-extrabold text-base text-slate-900">No Active Correction Requests</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your profile currently matches all institutional records without open disputes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
