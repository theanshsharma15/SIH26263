import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  Building2,
  ShieldAlert,
  ArrowRight,
  Info,
  Check,
  UserCheck,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const DynamicSeatComplianceLedger: React.FC = () => {
  const { courses, institutions, simulateNewAdmission, getSeatLedger } = useAppStore();
  const seatLedger = getSeatLedger();

  // Pick IIT Delhi CSE by default for the benchmark demo
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-iitd-cse');
  const [simulationToast, setSimulationToast] = useState<string | null>(null);
  const [reviewModalCase, setReviewModalCase] = useState<{ courseCode: string; status: string; notes: string } | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const selectedInstitution = institutions.find((i) => i.id === selectedCourse.institutionId);

  const filled = selectedCourse.actualEnrolled;
  const approved = selectedCourse.approvedIntake;
  const remaining = Math.max(0, approved - filled);
  const excess = Math.max(0, filled - approved);
  const percent = Math.round((filled / approved) * 100);

  const isExcess = excess > 0;
  const isNearCapacity = remaining <= 2 && remaining > 0;
  const isAtCapacity = remaining === 0 && excess === 0;

  const handleSimulateAdmission = () => {
    const res = simulateNewAdmission(selectedCourse.id);
    if (res.excess) {
      setSimulationToast(`LIVE WARNING TRIGGERED: Admission #${res.total} exceeds approved intake ceiling of ${res.approved} seats for ${selectedCourse.courseCode}!`);
    } else {
      setSimulationToast(`Candidate admitted into ${selectedCourse.courseCode}. Validated count: ${res.total}/${res.approved}. Seats remaining: ${res.remaining}.`);
    }
    setTimeout(() => setSimulationToast(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Innovation Feature #1 (SIH 2026 Problem Statement 26263)
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Dynamic Seat-Compliance Ledger & Real-Time Monitoring
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated quota ceiling monitor that fires real-time excess admission warnings as institutions accept students.
          </p>
        </div>
      </div>

      {/* Live Simulation Trigger Box (Judges Showcase) */}
      <div className="bg-gradient-to-r from-purple-900 via-gov-navy-900 to-gov-navy-950 text-white rounded-2xl p-6 shadow-elevated border border-purple-500/40 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-500 text-white rounded-xl">
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Live Admission Simulator For Evaluators
                </span>
                <h3 className="text-lg font-black text-white">
                  {selectedInstitution?.name} — {selectedCourse.courseName}
                </h3>
              </div>
            </div>

            {/* Course Selector Dropdown */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl outline-hidden"
              >
                {courses.map((c) => {
                  const inst = institutions.find((i) => i.id === c.institutionId);
                  return (
                    <option key={c.id} value={c.id} className="text-slate-900">
                      {inst?.shortName}: {c.courseCode} ({c.actualEnrolled}/{c.approvedIntake})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Interactive Live Gauge Card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
            <div className="p-3">
              <span className="text-[11px] text-purple-200 uppercase font-semibold block">Sanctioned Intake</span>
              <span className="text-3xl font-black text-white mt-1 block">{approved}</span>
              <span className="text-[10px] text-purple-300">AICTE Approved Ceiling</span>
            </div>

            <div className="p-3">
              <span className="text-[11px] text-purple-200 uppercase font-semibold block">Validated Admissions</span>
              <span className={`text-3xl font-black mt-1 block ${isExcess ? 'text-rose-400' : 'text-white'}`}>
                {filled}
              </span>
              <span className="text-[10px] text-purple-300">Confirmed in Ledger</span>
            </div>

            <div className="p-3">
              <span className="text-[11px] text-purple-200 uppercase font-semibold block">Remaining Vacancies</span>
              <span className={`text-3xl font-black mt-1 block ${remaining <= 2 && remaining > 0 ? 'text-amber-400' : remaining === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {remaining}
              </span>
              <span className="text-[10px] text-purple-300">Available Before Cap</span>
            </div>

            <div className="p-3 flex flex-col justify-center items-center">
              <button
                type="button"
                onClick={handleSimulateAdmission}
                className="w-full py-3 bg-gradient-to-r from-gov-saffron-500 to-amber-500 hover:from-gov-saffron-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Simulate New Admission</span>
              </button>
              <span className="text-[10px] text-purple-200 mt-1.5">Click to observe live threshold update</span>
            </div>
          </div>

          {/* Live Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-purple-200 font-bold">
              <span>Utilization: {percent}%</span>
              <span>
                {isExcess
                  ? `EXCESS ADMISSIONS: +${excess} SEATS VIOLATION`
                  : isNearCapacity
                  ? `WARNING: ONLY ${remaining} SEAT${remaining > 1 ? 'S' : ''} REMAINING`
                  : 'STATUS: NORMAL COMPLIANCE'}
              </span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (filled / approved) * 100)}%` }}
                className={`h-full transition-all duration-300 rounded-full ${
                  isExcess
                    ? 'bg-rose-500 animate-pulse'
                    : isNearCapacity
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Toast Banner for Excess Warning */}
      {simulationToast && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in ${
            simulationToast.includes('WARNING')
              ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-md'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          {simulationToast.includes('WARNING') ? (
            <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          )}
          <div className="text-xs font-bold leading-snug">
            {simulationToast}
          </div>
        </div>
      )}

      {/* Comprehensive National Seat Compliance Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              National AICTE Course Seat Compliance Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Monitoring all approved programs across institutions in real time
            </p>
          </div>
          <span className="text-xs font-mono bg-purple-50 text-purple-800 font-bold px-3 py-1 rounded-full border border-purple-200">
            {seatLedger.length} Academic Programs Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Institution</th>
                <th className="p-3.5">Program</th>
                <th className="p-3.5 text-center">Approved Intake</th>
                <th className="p-3.5 text-center">Validated Admissions</th>
                <th className="p-3.5 text-center">Remaining Seats</th>
                <th className="p-3.5 text-center">Supernumerary (TFW)</th>
                <th className="p-3.5 text-center">Compliance Status</th>
                <th className="p-3.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {seatLedger.map((row) => (
                <tr
                  key={row.courseId}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    row.isExcessWarning
                      ? 'bg-rose-50/40 font-semibold'
                      : row.remainingSeats <= 2
                      ? 'bg-amber-50/30'
                      : ''
                  }`}
                >
                  <td className="p-3.5 font-bold text-slate-900">
                    {row.institutionName}
                  </td>

                  <td className="p-3.5">
                    <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {row.courseCode}
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">{row.courseName}</span>
                  </td>

                  <td className="p-3.5 text-center font-bold text-slate-700">
                    {row.approvedIntake}
                  </td>

                  <td className="p-3.5 text-center font-bold">
                    <span className={row.isExcessWarning ? 'text-rose-600 font-black' : 'text-slate-900'}>
                      {row.validAdmissions}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        row.isExcessWarning
                          ? 'bg-rose-100 text-rose-800'
                          : row.remainingSeats <= 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {row.remainingSeats}
                    </span>
                  </td>

                  <td className="p-3.5 text-center font-mono text-purple-900">
                    {row.enrolledByCategory.supernumerary} / {row.categoryBreakdown.supernumerary}
                  </td>

                  <td className="p-3.5 text-center">
                    {row.isExcessWarning ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                        <AlertOctagon className="w-3 h-3" />
                        <span>Excess Breach (+{row.excessAdmissions})</span>
                      </span>
                    ) : row.remainingSeats <= 2 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Near Capacity</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Compliant</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setReviewModalCase({
                          courseCode: row.courseCode,
                          status: row.isExcessWarning ? 'Open (Urgent)' : 'Normal',
                          notes: row.isExcessWarning
                            ? `Automated warning triggered. Admitted students (${row.validAdmissions}) exceed approved quota (${row.approvedIntake}). Institutional explanation mandated within 7 days.`
                            : 'Intake currently within sanctioned limits.',
                        })
                      }
                      className="px-3 py-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded-lg text-xs font-bold transition-colors border border-slate-200"
                    >
                      Audit File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit File Review Modal */}
      {reviewModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-700" />
                <span>AICTE Compliance Review Dossier</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-600">{reviewModalCase.courseCode}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                  Investigation Status
                </span>
                <span className="font-bold text-slate-900 mt-0.5 block">{reviewModalCase.status}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                  Assigned AICTE Regulatory Officer
                </span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  Dr. Sunita Murthy (Director of Approvals, AICTE HQ)
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                  Regulatory Audit Observations
                </span>
                <p className="mt-1 p-3 bg-slate-50 border rounded-xl text-slate-700 leading-relaxed">
                  {reviewModalCase.notes}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setReviewModalCase(null)}
                className="px-4 py-2 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl text-xs font-bold"
              >
                Close Audit Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
