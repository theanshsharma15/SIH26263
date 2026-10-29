import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Building2,
  GraduationCap,
  Calendar,
  Lock,
  ExternalLink,
  Award,
  Sparkles,
  QrCode,
  FileCheck2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AcademicPassport, StudentRecord } from '../../types';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { PrototypeBanner } from '../../components/common/PrototypeBanner';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { DemoGuide } from '../../components/common/DemoGuide';
import { formatDateTime, formatDate, getTimeRemaining } from '../../utils/formatters';

export const VerifyTokenPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { recordPassportView, students } = useAppStore();

  const [passport, setPassport] = useState<AcademicPassport | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ isExpired: boolean; formatted: string }>({
    isExpired: false,
    formatted: '',
  });

  useEffect(() => {
    if (token) {
      const p = recordPassportView(token);
      setPassport(p);
      if (p) {
        setTimeRemaining(getTimeRemaining(p.expiresAt));
      }
    }
  }, [token]);

  // Live timer interval
  useEffect(() => {
    if (!passport) return;
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(passport.expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [passport]);

  const student = students.find((s) => s.id === passport?.studentId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <PrototypeBanner />
      <Header />

      <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {!passport ? (
          /* Invalid Token State */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-lg space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Academic Passport Token Invalid
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The verification token <span className="font-mono font-bold text-slate-800">{token}</span> could not be authenticated in the AICTE Permanent Academic Registry.
            </p>
            <Link
              to="/verify"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <span>Verify Another Academic Passport</span>
            </Link>
          </div>
        ) : passport.isRevoked ? (
          /* Revoked State */
          <div className="bg-white rounded-2xl border-2 border-rose-300 p-10 text-center shadow-lg space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold uppercase">
              Access Revoked
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Sharing Link Terminated by Student
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The student ({passport.studentName}) has actively revoked verification clearance for this specific token. No academic data can be viewed.
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Action timestamped in AICTE tamper-evident ledger.
            </p>
          </div>
        ) : timeRemaining.isExpired ? (
          /* Expired State */
          <div className="bg-white rounded-2xl border-2 border-amber-300 p-10 text-center shadow-lg space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">
              Validity Window Expired
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Academic Passport Has Expired
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The time-bound verification window for this credential reached expiration at {formatDateTime(passport.expiresAt)}.
            </p>
            <p className="text-xs text-slate-500">
              Please request the candidate to regenerate a fresh Verified Academic Passport.
            </p>
          </div>
        ) : (
          /* Fully Valid Verified Academic Passport Display */
          <div className="space-y-6 animate-in fade-in">
            {/* Top Verification Status Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-elevated flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xs text-white rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7 text-emerald-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 bg-white/10 px-2 py-0.5 rounded">
                      Authentic AICTE Verified Record
                    </span>
                    <SimulatedBadge size="sm" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Verified Academic Passport
                  </h1>
                  <p className="text-xs text-emerald-100">
                    Candidate: <strong className="text-white">{passport.studentName}</strong> • Recipient: {passport.recipientOrganization || 'Authorized Verifier'}
                  </p>
                </div>
              </div>

              {/* Countdown badge */}
              <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                  Link Expiration Countdown
                </span>
                <span className="text-sm font-mono font-black text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>{timeRemaining.formatted}</span>
                </span>
              </div>
            </div>

            {/* Recruiter Legend Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Verification Legend:
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified (Official Register)</span>
                </span>
                <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Validation</span>
                </span>
                <span className="inline-flex items-center gap-1 text-slate-600 font-bold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Student-Declared / Unverified</span>
                </span>
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                Passport Views: {passport.viewsCount}
              </span>
            </div>

            {/* Candidate Credentials Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-black text-lg text-slate-900">{passport.studentName}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    APAAR Identifier: <span className="font-mono font-bold text-slate-800">{passport.apaarId}</span>
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded border">
                  Token: {passport.token}
                </span>
              </div>

              {/* Shared Section 1: Institution & Program */}
              {passport.sharedFields.institutionAndCourse && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm text-slate-900">
                        Academic Institution & Program Enrollment
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified by AICTE</span>
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700 pl-7">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Approved Institution</span>
                      <span className="font-semibold text-slate-900">{passport.institutionName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Enrolled Program</span>
                      <span className="font-semibold text-slate-900">{passport.courseName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Admission Batch Year</span>
                      <span className="font-semibold text-slate-900">{passport.admissionYear}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Verification Register</span>
                      <span className="font-semibold text-emerald-800">AICTE Central Master Intake Ledger</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Section 2: Academic Grades & CGPA */}
              {passport.sharedFields.verifiedGrades && student && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm text-slate-900">
                        Higher Education Grades & Performance
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Autonomous Authority Verified</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center pl-7 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Cumulative CGPA</span>
                      <span className="text-xl font-black text-slate-900 block mt-0.5">
                        {student.academicRecord.cgpa} / 10.0
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Current Semester</span>
                      <span className="text-xl font-black text-slate-900 block mt-0.5">
                        Semester {student.academicRecord.semester}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Active Backlogs</span>
                      <span className="text-xl font-black text-slate-900 block mt-0.5">
                        {student.academicRecord.backlogs}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Section 3: Qualifications */}
              {passport.sharedFields.academicQualifications && student && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm text-slate-900">
                        National Entrance & Secondary Education
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DigiLocker / CBSE Verified</span>
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-700 pl-7">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Entrance Test</span>
                      <span className="font-semibold text-slate-900">{student.qualifications.entranceExam}</span>
                      <span className="text-emerald-700 font-bold block mt-1">Rank #{student.qualifications.entranceRank}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Class 12th Board</span>
                      <span className="font-semibold text-slate-900">{student.qualifications.twelfthBoard} ({student.qualifications.twelfthYear})</span>
                      <span className="text-slate-800 font-bold block mt-1">{student.qualifications.twelfthScore}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Class 10th Board</span>
                      <span className="font-semibold text-slate-900">{student.qualifications.tenthBoard} ({student.qualifications.tenthYear})</span>
                      <span className="text-slate-800 font-bold block mt-1">{student.qualifications.tenthScore}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Section 4: Self Reported */}
              {passport.sharedFields.attendanceStatus && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-700">
                      Candidate Self-Declared Projects & Skills
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                      Unverified (Student-Provided)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Full Stack Web Engineering, Machine Learning Research Intern, Distributed Systems.
                  </p>
                </div>
              )}

              {/* Statutory Disclaimer Mandated by Project Report */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Verification Policy & Legal Disclaimer</span>
                </p>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  Official verification depends on authorized institutional or government data sources. APAAR ID alone does not establish authenticity of every academic detail without independent institutional corroboration.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <DemoGuide />
    </div>
  );
};
