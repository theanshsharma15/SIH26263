import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Edit2,
  Check,
  X,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StudentRecord } from '../../types';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { MaskedId } from '../../components/common/MaskedId';
import { formatApaarId } from '../../utils/apaar';

export const ValidationIssues: React.FC = () => {
  const { currentUser, students, updateStudentRecord, institutions } = useAppStore();
  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];

  // Filter flagged records for current institution
  const flaggedStudents = students.filter(
    (s) => s.institutionId === currentInst.id && (s.status === 'Flagged' || s.status === 'NeedsCorrection')
  );

  const [fixingStudentId, setFixingStudentId] = useState<string | null>(null);
  const [fixApaarValue, setFixApaarValue] = useState<string>('');
  const [fixDobValue, setFixDobValue] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleStartFix = (s: StudentRecord) => {
    setFixingStudentId(s.id);
    setFixApaarValue(s.apaarId || '');
    setFixDobValue(s.dateOfBirth || '');
  };

  const handleApplyFix = (student: StudentRecord) => {
    const updated: StudentRecord = {
      ...student,
      apaarId: fixApaarValue ? formatApaarId(fixApaarValue) : student.apaarId,
      dateOfBirth: fixDobValue || student.dateOfBirth,
      status: 'Verified',
      flagReason: undefined,
      flagType: undefined,
      reconciliationStatus: 'Matched',
      reconciliationDiscrepancies: [],
    };

    updateStudentRecord(updated);
    setFixingStudentId(null);
    setSuccessMsg(`Issue resolved for ${student.fullName}. Record successfully verified and synchronized.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gov-navy-600 uppercase tracking-wider">
              Quality Assurance & Anomaly Resolver
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Enrolment Validation & Flagged Issues Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Resolve student admission data discrepancies flagged by the AICTE APAAR validation engine.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900">
          {flaggedStudents.length} Active Anomalies
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">{successMsg}</p>
        </div>
      )}

      {/* Issues List */}
      <div className="space-y-4">
        {flaggedStudents.map((s) => {
          const isFixing = fixingStudentId === s.id;

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-4 transition-all hover:border-rose-300"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <h3 className="font-extrabold text-sm text-slate-900">{s.fullName}</h3>
                    <span className="text-xs font-mono text-slate-400">({s.email})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Course ID: {s.courseId} • Quota: {s.seatCategory} • Admission: {s.admissionDate}
                  </p>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  {s.flagType || 'Validation Warning'}
                </span>
              </div>

              {/* Anomaly Reason */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Validation Anomaly Details:</p>
                  <p className="text-rose-800 mt-0.5 leading-relaxed">{s.flagReason}</p>
                </div>
              </div>

              {/* Action Area */}
              {isFixing ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800">
                    Fix & Rectify Candidate Record:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">
                        12-Digit APAAR ID:
                      </label>
                      <input
                        type="text"
                        value={fixApaarValue}
                        onChange={(e) => setFixApaarValue(e.target.value)}
                        placeholder="e.g. 9845-2134-7712"
                        className="w-full px-3 py-1.5 border rounded-lg font-mono bg-white border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFixApaarValue(
                            `9845-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`
                          )
                        }
                        className="text-[10px] text-gov-navy-600 font-bold underline mt-1"
                      >
                        Generate Valid APAAR
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">
                        Date of Birth (YYYY-MM-DD):
                      </label>
                      <input
                        type="date"
                        value={fixDobValue}
                        onChange={(e) => setFixDobValue(e.target.value)}
                        className="w-full px-3 py-1.5 border rounded-lg bg-white border-slate-300"
                      />
                      {s.simulatedReference && (
                        <button
                          type="button"
                          onClick={() => setFixDobValue(s.simulatedReference!.dateOfBirth)}
                          className="text-[10px] text-emerald-700 font-bold underline mt-1"
                        >
                          Sync with DigiLocker DOB ({s.simulatedReference.dateOfBirth})
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFixingStudentId(null)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyFix(s)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm & Re-verify Record</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-500">
                    Current APAAR: <MaskedId apaarId={s.apaarId} studentId={s.id} />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartFix(s)}
                    className="px-4 py-2 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gov-saffron-400" />
                    <span>Rectify Record</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {flaggedStudents.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Zero Unresolved Anomalies!
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All student admission records for {currentInst.shortName} comply with AICTE intake rules and APAAR specifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
