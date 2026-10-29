import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Shield,
  Building2,
  GraduationCap,
  FileCheck2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_USERS } from '../../data/seed';

export const DemoGuide: React.FC = () => {
  const {
    isDemoGuideOpen,
    setDemoGuideOpen,
    resetDemoData,
    login,
    currentUser,
  } = useAppStore();

  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [resetNotice, setResetNotice] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: 'Batch Upload Admission File',
      role: 'institution',
      roleName: 'Institution Admin (IIT Delhi)',
      user: DEMO_USERS[0],
      path: '/institution/upload',
      desc: 'Upload the pre-packaged sample_students.csv or drag & drop. System runs instantaneous APAAR format & uniqueness checks.',
    },
    {
      id: 2,
      title: 'Observe Flagged Records',
      role: 'institution',
      roleName: 'Institution Admin',
      user: DEMO_USERS[0],
      path: '/institution/upload',
      desc: 'System detects missing APAAR ID (Row 4) and duplicate APAAR ID collision with conflicting student details (Row 7).',
    },
    {
      id: 3,
      title: 'Inline Error Fix & Re-Validate',
      role: 'institution',
      roleName: 'Institution Admin',
      user: DEMO_USERS[0],
      path: '/institution/upload',
      desc: 'Fix the missing APAAR inline directly in the grid, click Re-validate, and commit accepted records to Central Repository.',
    },
    {
      id: 4,
      title: 'Seat Ledger & Excess Admission Check',
      role: 'institution',
      roleName: 'Institution Admin',
      user: DEMO_USERS[0],
      path: '/institution/seat-ledger',
      desc: 'View course intake breakdown (B.Tech CSE: 118/120 filled, only 2 remaining seats). Inspect category quotas.',
    },
    {
      id: 5,
      title: 'AICTE Oversight & Dynamic Ledger',
      role: 'aicte',
      roleName: 'AICTE Official',
      user: DEMO_USERS[1],
      path: '/aicte/seat-ledger',
      desc: 'Switch to AICTE Official. Click "Simulate New Admission" to watch real-time excess admission warnings trigger live!',
    },
    {
      id: 6,
      title: 'APAAR Reconciliation & Mismatches',
      role: 'aicte',
      roleName: 'AICTE Official',
      user: DEMO_USERS[1],
      path: '/aicte/reconciliation',
      desc: 'Inspect side-by-side mismatch comparison against Central ABC/DigiLocker registry for Priya Verma (DOB) and duplicate clusters.',
    },
    {
      id: 7,
      title: 'Student Transparency & Flag Explanation',
      role: 'student',
      roleName: 'Student (Priya Verma - Flagged)',
      user: DEMO_USERS[3],
      path: '/student/my-record',
      desc: 'Student logs in, views plain-language explanation of DOB discrepancy, and verifies that students cannot independently edit official records.',
    },
    {
      id: 8,
      title: 'Generate Verified Academic Passport',
      role: 'student',
      roleName: 'Student (Rohit Sharma - Clean)',
      user: DEMO_USERS[2],
      path: '/student/passport',
      desc: 'Student selects permitted fields, sets 24h validity, checks mandatory consent, and creates a QR code + tokenized sharing link.',
    },
    {
      id: 9,
      title: 'Recruiter Verification Experience',
      role: 'recruiter',
      roleName: 'Recruiter (TCS Talent)',
      user: DEMO_USERS[4],
      path: '/verify/rohit-iitd-verified-token',
      desc: 'Recruiter inspects verified badges, verification dates, countdown timer, and simulated authenticators.',
    },
    {
      id: 10,
      title: 'AICTE Central Audit Logs & Reports',
      role: 'aicte',
      roleName: 'AICTE Official',
      user: DEMO_USERS[1],
      path: '/aicte/audit-logs',
      desc: 'Review tamper-evident audit logs capturing every upload, APAAR reveal, passport generation, and recruiter verification view.',
    },
  ];

  const handleStepJump = (step: (typeof steps)[0]) => {
    setActiveStep(step.id);
    login(step.user);
    navigate(step.path);
    setCompletedSteps((prev) => ({ ...prev, [step.id]: true }));
  };

  const handleReset = () => {
    resetDemoData();
    setCompletedSteps({});
    setActiveStep(1);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
    navigate('/institution/dashboard');
  };

  if (!isDemoGuideOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setDemoGuideOpen(true)}
          className="flex items-center gap-2 bg-gov-navy-900 text-white px-4 py-2.5 rounded-full shadow-2xl hover:bg-gov-navy-800 border-2 border-gov-saffron-500 font-bold text-xs transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-gov-saffron-400 animate-spin" />
          <span>SIH 2026 Demo Guide</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Demo Flow Guide" className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border-2 border-gov-navy-600 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-gov-navy-900 to-gov-navy-800 text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gov-saffron-500 rounded-lg text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-gov-saffron-300">
              Evaluator Demo Flow
            </h4>
            <p className="text-[11px] text-slate-300">
              Smart India Hackathon 2026 (PS-26263)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            title="Reset All Synthetic Demo Data to Factory State"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-lg text-xs transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px]">Reset</span>
          </button>
          <button
            onClick={() => setDemoGuideOpen(false)}
            aria-label="Minimize Demo Guide"
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {resetNotice && (
        <div className="bg-emerald-600 text-white text-xs px-3 py-1.5 text-center font-semibold">
          Demo data reset to factory initial state!
        </div>
      )}

      {/* Steps List */}
      <div className="max-h-[380px] overflow-y-auto p-3 space-y-2 text-xs divide-y divide-slate-100">
        {steps.map((s) => {
          const isCurrent = activeStep === s.id;
          const isDone = !!completedSteps[s.id];

          return (
            <div
              key={s.id}
              className={`pt-2 pb-1 transition-all rounded-lg p-2 ${
                isCurrent
                  ? 'bg-gov-navy-50/70 border border-gov-navy-200'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-gov-navy-700 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                      <span>{s.title}</span>
                    </h5>
                    <p className="text-[11px] text-gov-saffron-700 font-semibold mt-0.5">
                      {s.roleName}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStepJump(s)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold shrink-0 transition-colors flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-gov-saffron-500 hover:bg-gov-saffron-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Go</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="bg-slate-50 border-t border-slate-200 p-2.5 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="font-medium">Active: {currentUser?.name} ({currentUser?.role})</span>
        <button
          onClick={handleReset}
          className="text-gov-navy-700 hover:text-gov-navy-900 font-bold underline"
        >
          Reset All Data
        </button>
      </div>
    </aside>
  );
};
