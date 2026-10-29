import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Lock,
  Building2,
  GraduationCap,
  Sparkles,
  Clock,
  Download,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MaskedId } from '../../components/common/MaskedId';
import { formatDate } from '../../utils/formatters';

export const VerifiedPassport: React.FC = () => {
  const { currentUser, students, institutions, courses, generatePassport, passports, revokePassport } = useAppStore();

  const currentStudent = students.find((s) => s.apaarId === currentUser?.apaarId) || students[0];
  const institution = institutions.find((i) => i.id === currentStudent?.institutionId);
  const course = courses.find((c) => c.id === currentStudent?.courseId);

  // Field toggles
  const [shareInstitution, setShareInstitution] = useState(true);
  const [shareAdmission, setShareAdmission] = useState(true);
  const [shareQualifications, setShareQualifications] = useState(true);
  const [shareGrades, setShareGrades] = useState(true);
  const [shareExtracurricular, setShareExtracurricular] = useState(false);

  // Options
  const [expiryHours, setExpiryHours] = useState<number>(24);
  const [recipientOrg, setRecipientOrg] = useState('Tata Consultancy Services - Campus Hiring');
  const [recipientName, setRecipientName] = useState('Vikram Seth');
  const [hasConsented, setHasConsented] = useState(false);

  // Generated state
  const [generatedToken, setGeneratedToken] = useState<string | null>('rohit-iitd-verified-token');
  const [copiedLink, setCopiedLink] = useState(false);

  const activePassport = passports.find((p) => p.token === generatedToken);

  const handleGeneratePassport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConsented) {
      alert('You must provide mandatory privacy consent before creating an Academic Passport.');
      return;
    }

    const token = generatePassport({
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      apaarId: currentStudent.apaarId,
      institutionName: institution?.name || 'Technical Institution',
      courseName: course?.courseName || 'Engineering Course',
      admissionYear: currentStudent.admissionYear,
      recipientName: recipientName.trim() || undefined,
      recipientOrganization: recipientOrg.trim() || undefined,
      durationHours: expiryHours,
      sharedFields: {
        institutionAndCourse: shareInstitution,
        admissionDetails: shareAdmission,
        academicQualifications: shareQualifications,
        verifiedGrades: shareGrades,
        attendanceStatus: shareExtracurricular,
      },
      verifiedBadges: {
        institutionAndCourse: {
          status: 'Verified',
          source: 'AICTE Institution Master Registry',
          verifiedAt: new Date().toISOString(),
        },
        admissionDetails: {
          status: 'Verified',
          source: `${institution?.shortName || 'College'} Admission Cell Ledger`,
          verifiedAt: new Date().toISOString(),
        },
        academicQualifications: {
          status: 'Verified',
          source: 'DigiLocker / CBSE Central Board Sync',
          verifiedAt: new Date().toISOString(),
        },
        verifiedGrades: {
          status: 'Verified',
          source: 'Autonomous Academic Exam Portal',
          verifiedAt: new Date().toISOString(),
        },
        studentExtracurricular: {
          status: 'Unverified',
          source: 'Student Self-Reported (Unverified)',
        },
      },
    });

    setGeneratedToken(token);
  };

  const getVerificationUrl = (token: string) => {
    return `${window.location.origin}/verify/${token}`;
  };

  const copyToClipboard = () => {
    if (!generatedToken) return;
    navigator.clipboard.writeText(getVerificationUrl(generatedToken));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Innovation Feature #4 (SIH 2026 Problem Statement 26263)
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Verified Academic Passport Generator
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create a cryptographically secure, time-limited QR and token link to share verified credentials with employers.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              1. Permitted Data Field Selection
            </h3>
            <p className="text-xs text-slate-500">
              Select which verified academic details recruiters are authorized to inspect.
            </p>
          </div>

          <div className="space-y-3">
            {/* Field 1 */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={shareInstitution}
                onChange={(e) => setShareInstitution(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Institution & Degree Course</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified by AICTE
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  IIT Delhi • B.Tech Computer Science & Engineering
                </p>
              </div>
            </label>

            {/* Field 2 */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={shareAdmission}
                onChange={(e) => setShareAdmission(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Admission & Enrolment Authority</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified by College
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Admission Year 2024 • Sanctioned General Category Seat
                </p>
              </div>
            </label>

            {/* Field 3 */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={shareQualifications}
                onChange={(e) => setShareQualifications(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Secondary & Entrance Qualifications</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified via DigiLocker
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  CBSE Class 10 (96.2%), Class 12 (95.8%), JEE Advanced AIR #312
                </p>
              </div>
            </label>

            {/* Field 4 */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={shareGrades}
                onChange={(e) => setShareGrades(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Verified Academic Grades & CGPA</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Autonomous Grading
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Cumulative GPA: 9.15 / 10.0 (Zero backlogs)
                </p>
              </div>
            </label>

            {/* Field 5: Unverified field */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-dashed border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={shareExtracurricular}
                onChange={(e) => setShareExtracurricular(e.target.checked)}
                className="mt-0.5 rounded text-slate-600 focus:ring-slate-500 w-4 h-4"
              />
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Self-Declared Projects & Skills</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                    Unverified (Student-Declared)
                  </span>
                </div>
                <p className="text-slate-400 mt-0.5">
                  Students cannot mark self-reported items as verified.
                </p>
              </div>
            </label>
          </div>

          <form onSubmit={handleGeneratePassport} className="space-y-4 pt-2 border-t">
            <h3 className="font-extrabold text-sm text-slate-900">
              2. Target Employer & Link Validity
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Recipient Organization (Optional):
                </label>
                <input
                  type="text"
                  value={recipientOrg}
                  onChange={(e) => setRecipientOrg(e.target.value)}
                  placeholder="e.g. Google, TCS, Infosys"
                  className="w-full p-2 border rounded-xl border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Recipient Name (Optional):
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Hiring Manager"
                  className="w-full p-2 border rounded-xl border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs">
                Passport Link Validity Window:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { hours: 1, label: '1 Hour (Interview)' },
                  { hours: 24, label: '24 Hours (Standard)' },
                  { hours: 168, label: '7 Days (Campus Drive)' },
                ].map((opt) => (
                  <button
                    key={opt.hours}
                    type="button"
                    onClick={() => setExpiryHours(opt.hours)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      expiryHours === opt.hours
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandatory Consent Checkbox */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasConsented}
                  onChange={(e) => setHasConsented(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs text-emerald-950 leading-snug">
                  <strong>Mandatory Privacy Consent: </strong>
                  I explicitly authorize the release of my selected academic records to {recipientOrg || 'the designated recipient'}. I acknowledge access is logged and time-bound.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Generate Verified Academic Passport</span>
            </button>
          </form>
        </div>

        {/* Right: Live Passport Certificate Preview & QR Code */}
        <div className="lg:col-span-6 space-y-5">
          {generatedToken && activePassport ? (
            <div className="bg-gradient-to-b from-white via-slate-50 to-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-elevated space-y-5 relative">
              {/* Certificate Border Accents */}
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                      AICTE Verified Digital Academic Passport
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {currentStudent.fullName}
                    </h3>
                  </div>
                </div>

                <SimulatedBadge size="sm" />
              </div>

              {/* QR Code and Quick Share */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                  <QRCodeSVG
                    value={getVerificationUrl(generatedToken)}
                    size={120}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="text-xs space-y-2 flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Active Token Link (Valid for {expiryHours}h)</span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-500 truncate bg-slate-50 p-1.5 rounded border border-slate-200">
                    {getVerificationUrl(generatedToken)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Secure Link'}</span>
                    </button>

                    <a
                      href={getVerificationUrl(generatedToken)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <span>Simulate Recruiter View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Badges Checklist Preview */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
                  Verified Permitted Credentials Preview:
                </h4>

                {shareInstitution && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{institution?.name}</span>
                      <span className="text-[11px] text-slate-500">{course?.courseName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </div>
                )}

                {shareGrades && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Grading & Academic Transcript</span>
                      <span className="text-[11px] text-slate-500">CGPA: {currentStudent.academicRecord.cgpa} / 10.0</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verified (Exam Cell)
                    </span>
                  </div>
                )}

                {shareQualifications && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">National Entrance Exam Rank</span>
                      <span className="text-[11px] text-slate-500">JEE Advanced (Rank #{currentStudent.qualifications.entranceRank})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verified (DigiLocker)
                    </span>
                  </div>
                )}
              </div>

              {/* Revoke Option */}
              <div className="pt-3 border-t flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Target: {activePassport.recipientOrganization || 'Recruiter'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    revokePassport(activePassport.id);
                    alert('Sharing passport revoked. The link is now instantly invalidated.');
                  }}
                  className="text-rose-600 hover:text-rose-800 font-bold underline"
                >
                  Revoke Link Now
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-3">
              <QrCode className="w-16 h-16 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">No Passport Generated Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Configure your permissions on the left and grant consent to generate a shareable QR passport.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
