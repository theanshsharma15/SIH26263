import React, { useState } from 'react';
import {
  FileEdit,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CorrectionRequest } from '../../types';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const CorrectionsQueue: React.FC = () => {
  const { currentUser, corrections, updateCorrectionStatus, institutions } = useAppStore();
  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];

  const instCorrections = corrections.filter((c) => c.institutionId === currentInst.id);

  const [activeModalRequest, setActiveModalRequest] = useState<CorrectionRequest | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'Updated' | 'Rejected'>('Updated');
  const [toastMessage, setToastMessage] = useState('');

  const openDecisionModal = (req: CorrectionRequest, type: 'Updated' | 'Rejected') => {
    setActiveModalRequest(req);
    setActionType(type);
    setRemarks(
      type === 'Updated'
        ? `Verified against Matriculation certificate. Synchronized with Central APAAR repository on ${new Date().toLocaleDateString('en-IN')}.`
        : 'Discrepancy in submitted supporting documentation. Please resubmit with attested document.'
    );
  };

  const handleConfirmDecision = () => {
    if (!activeModalRequest) return;
    updateCorrectionStatus(activeModalRequest.id, actionType, remarks);
    setToastMessage(
      actionType === 'Updated'
        ? `Correction request for ${activeModalRequest.studentName} approved and updated! Student record status is now Verified.`
        : `Correction request for ${activeModalRequest.studentName} rejected.`
    );
    setActiveModalRequest(null);
    setTimeout(() => setToastMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gov-navy-600 uppercase tracking-wider">
              Student Grievance & Rectification Queue
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Student Correction Requests Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review formal rectification requests submitted by students from the Student Transparency Portal.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-gov-navy-50 border border-gov-navy-200 rounded-xl text-xs font-bold text-gov-navy-900">
          {instCorrections.filter((c) => c.status === 'Requested').length} Pending Decision
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {instCorrections.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 transition-all hover:border-slate-300"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900">{req.studentName}</h3>
                  <span className="text-xs font-mono text-slate-500">APAAR: {req.apaarId}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Program: {req.courseName} • Submitted: {formatDateTime(req.createdAt)}
                </p>
              </div>

              <StatusBadge status={req.status} />
            </div>

            {/* Field change comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                  Field Requested
                </span>
                <span className="font-bold text-slate-800 capitalize mt-0.5 block">
                  {req.fieldToCorrect}
                </span>
              </div>

              <div>
                <span className="text-rose-500 font-bold uppercase tracking-wider text-[10px] block">
                  Current Erroneous Value
                </span>
                <span className="font-mono font-semibold text-rose-800 line-through mt-0.5 block">
                  {req.currentValue}
                </span>
              </div>

              <div>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] block">
                  Requested Valid Value
                </span>
                <span className="font-mono font-bold text-emerald-800 mt-0.5 block">
                  {req.requestedValue}
                </span>
              </div>
            </div>

            {/* Student remarks & attachment */}
            <div className="text-xs text-slate-600 space-y-1">
              <p>
                <strong className="text-slate-800">Student Explanation: </strong>
                {req.reason}
              </p>
              {req.documentName && (
                <div className="flex items-center gap-1.5 text-gov-navy-700 font-semibold mt-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Simulated Supporting Doc: {req.documentName}</span>
                </div>
              )}
            </div>

            {/* Institution remarks if decided */}
            {req.institutionRemarks && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
                <span className="font-bold block text-[11px]">Registrar Official Note:</span>
                <p className="mt-0.5">{req.institutionRemarks}</p>
              </div>
            )}

            {/* Action buttons if still pending */}
            {req.status === 'Requested' && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openDecisionModal(req, 'Rejected')}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors border border-rose-200 flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Request</span>
                </button>

                <button
                  type="button"
                  onClick={() => openDecisionModal(req, 'Updated')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Update Central Record</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {instCorrections.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-bold text-sm">No correction requests received.</p>
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {activeModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              {actionType === 'Updated' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Confirm Approval of Record Correction</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Confirm Rejection of Request</span>
                </>
              )}
            </h3>

            <p className="text-xs text-slate-600">
              Candidate: <strong className="text-slate-900">{activeModalRequest.studentName}</strong> ({activeModalRequest.fieldToCorrect})
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registrar Remarks & Verification Notes:
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-gov-navy-400 outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalRequest(null)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-4 py-2 text-white rounded-lg text-xs font-bold shadow-xs ${
                  actionType === 'Updated'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionType === 'Updated' ? 'Authorize & Sync Record' : 'Submit Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
