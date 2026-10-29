import React, { useState } from 'react';
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Search,
  ExternalLink,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StudentRecord } from '../../types';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { MaskedId } from '../../components/common/MaskedId';
import { formatDate } from '../../utils/formatters';

export const ApaarReconciliation: React.FC = () => {
  const { students, resolveFlaggedCase, addAuditLog, institutions } = useAppStore();

  const [activeTab, setActiveTab] = useState<'mismatches' | 'duplicates'>('mismatches');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stud-flag-dob'); // Priya Verma by default
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 1. Data Mismatches against reference registry
  const mismatchStudents = students.filter(
    (s) => s.reconciliationStatus === 'Discrepancy' && s.flagType !== 'DuplicateId'
  );

  // 2. Duplicate Clusters: students that share the exact same APAAR ID
  const duplicateClusters: Record<string, StudentRecord[]> = {};
  students.forEach((s) => {
    if (s.apaarId && s.apaarId.trim() !== '') {
      duplicateClusters[s.apaarId] = duplicateClusters[s.apaarId] || [];
      duplicateClusters[s.apaarId].push(s);
    }
  });

  const duplicateGroups = Object.entries(duplicateClusters).filter(
    ([_, list]) => list.length > 1
  );

  const activeStudent = students.find((s) => s.id === selectedStudentId) || mismatchStudents[0];
  const studentInst = institutions.find((i) => i.id === activeStudent?.institutionId);

  const handleResolve = () => {
    if (!activeStudent) return;
    resolveFlaggedCase(activeStudent.id, resolutionNotes || 'Resolved after authoritative cross-check by AICTE Compliance Officer.');
    setToastMessage(`Discrepancy marked as RESOLVED for ${activeStudent.fullName}. Record synchronized with Central Registry.`);
    setResolutionNotes('');
    setTimeout(() => setToastMessage(''), 5000);
  };

  const handleEscalate = () => {
    if (!activeStudent) return;
    addAuditLog(
      'FLAG_RESOLVED',
      `Escalation Notice: ${activeStudent.fullName} (${activeStudent.id})`,
      `AICTE Director escalated record discrepancy to Institutional Registrar for physical document verification.`
    );
    setToastMessage(`Formal compliance escalation notice issued to ${studentInst?.name || 'Institution'}.`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Innovation Feature #2 (SIH 2026 Problem Statement 26263)
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            APAAR Central Data Reconciliation Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated cross-system comparison between institutional submissions and national DigiLocker/ABC registries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('mismatches')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'mismatches'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Field Mismatches ({mismatchStudents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('duplicates')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'duplicates'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Duplicate Clusters ({duplicateGroups.length})
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {activeTab === 'mismatches' ? (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Discrepancy Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              Active Discrepancy Cases:
            </h3>

            {mismatchStudents.map((s) => {
              const isSelected = s.id === selectedStudentId;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-xs text-slate-900">{s.fullName}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Mismatch
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    APAAR: {s.apaarId}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {s.flagReason}
                  </p>
                </div>
              );
            })}

            {mismatchStudents.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border text-slate-500 text-xs">
                All records currently reconciled.
              </div>
            )}
          </div>

          {/* Right: Side-by-Side Diff Inspector */}
          {activeStudent && (
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">
                      Side-By-Side Reference Comparison: {activeStudent.fullName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Institution: <strong className="text-slate-800">{studentInst?.name}</strong> • APAAR: <MaskedId apaarId={activeStudent.apaarId} studentId={activeStudent.id} />
                  </p>
                </div>

                <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-xs font-bold">
                  Field Discrepancy Flagged
                </span>
              </div>

              {/* Side-by-Side Dual Column Diff */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Column 1: Submitted College Record */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-xs uppercase text-slate-700">
                      1. Institutional Record
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">Submitted via Batch Ingestion</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate Name</span>
                      <span className={`font-semibold text-slate-900 ${activeStudent.fullName !== activeStudent.simulatedReference?.fullName ? 'bg-amber-100 px-1 py-0.5 rounded text-amber-900' : ''}`}>
                        {activeStudent.fullName}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                      <span className={`font-semibold font-mono ${activeStudent.dateOfBirth !== activeStudent.simulatedReference?.dateOfBirth ? 'bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300 font-black' : 'text-slate-900'}`}>
                        {formatDate(activeStudent.dateOfBirth)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
                      <span className="font-semibold text-slate-900">{activeStudent.gender}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Seat Category</span>
                      <span className="font-semibold text-slate-900">{activeStudent.seatCategory}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Simulated DigiLocker / ABC National Reference Source */}
                <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-700" />
                      <span className="font-extrabold text-xs uppercase text-sky-900">
                        2. National Reference Registry
                      </span>
                    </div>
                    <SimulatedBadge size="sm" />
                  </div>

                  {activeStudent.simulatedReference ? (
                    <div className="space-y-3 text-xs text-sky-950">
                      <div>
                        <span className="text-sky-600 block text-[10px] uppercase font-bold">Aadhaar / KYC Name</span>
                        <span className={`font-semibold ${activeStudent.fullName !== activeStudent.simulatedReference.fullName ? 'bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-black' : ''}`}>
                          {activeStudent.simulatedReference.fullName}
                        </span>
                      </div>

                      <div>
                        <span className="text-sky-600 block text-[10px] uppercase font-bold">National Registry DOB</span>
                        <span className={`font-semibold font-mono ${activeStudent.dateOfBirth !== activeStudent.simulatedReference.dateOfBirth ? 'bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 font-black' : ''}`}>
                          {formatDate(activeStudent.simulatedReference.dateOfBirth)}
                        </span>
                      </div>

                      <div>
                        <span className="text-sky-600 block text-[10px] uppercase font-bold">Father&apos;s Name</span>
                        <span className="font-semibold">{activeStudent.simulatedReference.fatherName}</span>
                      </div>

                      <div>
                        <span className="text-sky-600 block text-[10px] uppercase font-bold">ABC Account ID</span>
                        <span className="font-mono font-bold text-sky-800">{activeStudent.simulatedReference.abcAccountId}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No external reference record available.</p>
                  )}
                </div>
              </div>

              {/* Regulatory Decision Action Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-xs text-slate-900">
                  AICTE Regulatory Action & Resolution:
                </h4>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Enter regulatory investigation notes (e.g. Verified with Matriculation certificate)..."
                  className="w-full p-2.5 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-purple-400 outline-hidden bg-white"
                />

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleEscalate}
                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs transition-colors border border-amber-300 flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Escalate to Institutional Registrar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResolve}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />
                    <span>Authorize & Mark Resolved</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Duplicate Cluster View */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-1">
              Cross-Institutional Duplicate APAAR Clusters
            </h3>
            <p className="text-xs text-slate-500">
              Anti-duplication engine identifies occurrences where the same 12-digit APAAR ID has been assigned to multiple distinct student records.
            </p>
          </div>

          {duplicateGroups.map(([apaarId, clusterStudents]) => (
            <div
              key={apaarId}
              className="bg-white rounded-2xl border-2 border-rose-300 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-rose-600 text-white rounded-lg">
                    <AlertOctagon className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Collision Cluster: APAAR {apaarId}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {clusterStudents.length} candidate records share this exact permanent academic identifier!
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold border border-rose-300">
                  Critical Collision Detected
                </span>
              </div>

              {/* Clashing Students Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {clusterStudents.map((s, idx) => {
                  const inst = institutions.find((i) => i.id === s.institutionId);
                  return (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Record #{idx + 1}: {s.fullName}</span>
                        <span className="text-[10px] font-mono text-slate-500">ID: {s.id}</span>
                      </div>
                      <div className="space-y-1 text-slate-600">
                        <p>
                          <strong className="text-slate-800">Institution: </strong>
                          {inst?.name}
                        </p>
                        <p>
                          <strong className="text-slate-800">Email: </strong>
                          {s.email}
                        </p>
                        <p>
                          <strong className="text-slate-800">DOB: </strong>
                          {formatDate(s.dateOfBirth)}
                        </p>
                        <p>
                          <strong className="text-slate-800">Course: </strong>
                          {s.courseId}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span className="text-slate-500">
                  Both records are frozen pending physical verification and UIDAI eKYC binding.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    addAuditLog(
                      'FLAG_RESOLVED',
                      `Duplicate Cluster ${apaarId}`,
                      `Initiated formal inquiry into duplicate APAAR collision across ${clusterStudents.map((c) => c.fullName).join(' and ')}.`
                    );
                    setToastMessage(`Formal investigation initiated for collision cluster ${apaarId}.`);
                    setTimeout(() => setToastMessage(''), 4000);
                  }}
                  className="px-4 py-2 bg-gov-navy-600 hover:bg-gov-navy-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                >
                  Initiate AICTE Investigation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
