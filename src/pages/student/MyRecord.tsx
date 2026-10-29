import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MaskedId } from '../../components/common/MaskedId';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { formatDate } from '../../utils/formatters';

export const MyRecord: React.FC = () => {
  const { currentUser, students, institutions, courses, submitCorrectionRequest } = useAppStore();

  const currentStudent = students.find((s) => s.apaarId === currentUser?.apaarId) || students[0];
  const institution = institutions.find((i) => i.id === currentStudent?.institutionId);
  const course = courses.find((c) => c.id === currentStudent?.courseId);

  // Correction Request Modal state
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [fieldToCorrect, setFieldToCorrect] = useState('dateOfBirth');
  const [requestedValue, setRequestedValue] = useState('');
  const [reason, setReason] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const isFlagged = currentStudent.status === 'Flagged' || currentStudent.status === 'NeedsCorrection';

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedValue.trim() || !reason.trim()) return;

    let currentValue = '';
    if (fieldToCorrect === 'dateOfBirth') currentValue = currentStudent.dateOfBirth;
    else if (fieldToCorrect === 'fullName') currentValue = currentStudent.fullName;
    else if (fieldToCorrect === 'email') currentValue = currentStudent.email;
    else if (fieldToCorrect === 'phone') currentValue = currentStudent.phone;

    submitCorrectionRequest({
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      apaarId: currentStudent.apaarId,
      institutionId: currentStudent.institutionId,
      courseName: course?.courseName || 'Engineering Program',
      fieldToCorrect,
      currentValue,
      requestedValue: requestedValue.trim(),
      reason: reason.trim(),
      documentName: `${currentStudent.fullName.replace(/\s+/g, '_')}_Verification_Doc.pdf`,
    });

    setIsCorrectionModalOpen(false);
    setRequestedValue('');
    setReason('');
    setSuccessToast('Correction request submitted to your institution. Track progress in the Corrections Tracker.');
    setTimeout(() => setSuccessToast(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Student Academic Transparency Portal
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            My Permanent Academic Profile & Record Status
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official APAAR-linked academic record as submitted by {institution?.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isFlagged ? (
            <button
              type="button"
              onClick={() => setIsCorrectionModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              <FileEdit className="w-4 h-4" />
              <span>Request Institutional Correction</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Record Fully Verified</span>
            </span>
          )}
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">{successToast}</p>
        </div>
      )}

      {/* Mandatory Student Security & Privacy Guard Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-xs flex items-start gap-3.5 border-l-4 border-gov-saffron-500">
        <div className="p-2 bg-gov-saffron-500 text-white rounded-xl shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h3 className="font-extrabold text-sm text-white">
            Data Integrity & Modification Safeguard Policy
          </h3>
          <p className="text-slate-300 leading-relaxed">
            In accordance with AICTE data governance, <strong>students can NEVER directly alter official academic records or self-certify verification</strong>.
            All discrepancies must be reviewed and officially signed off by your institution&apos;s Registrar.
          </p>
        </div>
      </div>

      {/* Flag Explanation Box (if record is flagged) */}
      {isFlagged && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 text-rose-900 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-rose-600 text-white rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-rose-950">
                Action Required: Anomaly Detected in Your Official Record
              </h3>
              <p className="text-xs text-rose-800">
                The central AICTE reconciliation engine identified an inconsistency with government master registries.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-rose-200 text-xs">
            <p className="font-bold text-rose-900 mb-1">Plain-Language Explanation:</p>
            <p className="text-slate-700 leading-relaxed">
              {currentStudent.flagReason || 'A discrepancy exists between your institutional record and the Central DigiLocker/ABC registry.'}
            </p>
            {currentStudent.simulatedReference && (
              <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                <p>
                  <strong>College Record: </strong>
                  <span className="font-mono text-rose-700 font-bold">{formatDate(currentStudent.dateOfBirth)}</span>
                </p>
                <p>
                  <strong>National Registry Record: </strong>
                  <span className="font-mono text-emerald-700 font-bold">{formatDate(currentStudent.simulatedReference.dateOfBirth)}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-rose-800 font-medium">
              Submit supporting proof (e.g. Class 10 certificate) to IIT Delhi Academic Cell.
            </p>
            <button
              type="button"
              onClick={() => setIsCorrectionModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileEdit className="w-4 h-4" />
              <span>Initiate Correction Request</span>
            </button>
          </div>
        </div>
      )}

      {/* Verification Lifecycle Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">
          Enrolment Lifecycle & Verification Progress
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
            <p className="font-bold text-slate-900">1. Ingested</p>
            <span className="text-[10px] text-emerald-700 block">Submitted by Institution</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
            <p className="font-bold text-slate-900">2. Validated</p>
            <span className="text-[10px] text-emerald-700 block">12-Digit APAAR Format Verified</span>
          </div>

          <div className={`p-3 rounded-xl border space-y-1 ${
            currentStudent.status === 'Verified'
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-amber-50 border-amber-300'
          }`}>
            {currentStudent.status === 'Verified' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600 mx-auto" />
            )}
            <p className="font-bold text-slate-900">3. Verification</p>
            <span className={`text-[10px] font-bold block ${
              currentStudent.status === 'Verified' ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {currentStudent.status === 'Verified' ? 'Authority Verified' : 'Correction Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">{currentStudent.fullName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {institution?.name} • Program: {course?.courseName}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Permanent APAAR ID
            </span>
            <div className="mt-1">
              <MaskedId apaarId={currentStudent.apaarId} studentId={currentStudent.id} />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs text-slate-700">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Date of Birth</span>
            <span className="font-semibold text-slate-900 text-sm mt-0.5 block">{formatDate(currentStudent.dateOfBirth)}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Gender</span>
            <span className="font-semibold text-slate-900 text-sm mt-0.5 block">{currentStudent.gender}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Institutional Email</span>
            <span className="font-mono text-slate-900 mt-0.5 block">{currentStudent.email}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Admission Quota</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">{currentStudent.seatCategory}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Admission Year</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">{currentStudent.admissionYear}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Academic Exam Authority</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">{currentStudent.academicRecord.verifiedBy}</span>
          </div>
        </div>

        {/* Academic Marks */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
            Academic Performance (Autonomous Evaluation)
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Cumulative GPA</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{currentStudent.academicRecord.cgpa ?? 'N/A'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Semester</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">Sem {currentStudent.academicRecord.semester}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Backlogs</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{currentStudent.academicRecord.backlogs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Correction Request Modal */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Submit Institutional Correction Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCorrectionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Field Requiring Rectification:
                </label>
                <select
                  value={fieldToCorrect}
                  onChange={(e) => setFieldToCorrect(e.target.value)}
                  className="w-full p-2.5 border rounded-xl border-slate-300 font-medium"
                >
                  <option value="dateOfBirth">Date of Birth</option>
                  <option value="fullName">Full Name</option>
                  <option value="email">Institutional Email</option>
                  <option value="phone">Registered Phone</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Correct Requested Value:
                </label>
                <input
                  type={fieldToCorrect === 'dateOfBirth' ? 'date' : 'text'}
                  value={requestedValue}
                  onChange={(e) => setRequestedValue(e.target.value)}
                  placeholder={fieldToCorrect === 'dateOfBirth' ? 'YYYY-MM-DD' : 'Enter correct spelling/value'}
                  required
                  className="w-full p-2.5 border rounded-xl border-slate-300 bg-white"
                />
                {fieldToCorrect === 'dateOfBirth' && currentStudent.simulatedReference && (
                  <button
                    type="button"
                    onClick={() => setRequestedValue(currentStudent.simulatedReference!.dateOfBirth)}
                    className="text-[10px] text-emerald-700 font-bold underline mt-1"
                  >
                    Auto-Fill DigiLocker Verified Date: {currentStudent.simulatedReference.dateOfBirth}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Reason for Rectification & Document Details:
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this value was entered incorrectly during college admission..."
                  required
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-snug">
                <strong>Notice: </strong>
                Your request will be routed directly to the IIT Delhi Registrar office. Records update upon official verification.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
