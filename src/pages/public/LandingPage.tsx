import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Layers,
  GitCompare,
  UserCheck,
  QrCode,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  GraduationCap,
  FileCheck2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  Activity,
  FileText,
  Lock,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { PrototypeBanner } from '../../components/common/PrototypeBanner';
import { DemoGuide } from '../../components/common/DemoGuide';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { LoginModal } from '../../components/auth/LoginModal';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_USERS } from '../../data/seed';

export const LandingPage: React.FC = () => {
  const { t } = useAccessibility();
  const { login } = useAppStore();
  const navigate = useNavigate();

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [quickVerifyToken, setQuickVerifyToken] = useState('');

  const handleRoleQuickEntry = (demoUser: typeof DEMO_USERS[0]) => {
    login(demoUser);
    if (demoUser.role === 'institution') navigate('/institution/dashboard');
    else if (demoUser.role === 'aicte') navigate('/aicte/overview');
    else if (demoUser.role === 'student') navigate('/student/my-record');
    else if (demoUser.role === 'recruiter') navigate('/verify');
  };

  const handleQuickVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickVerifyToken.trim()) {
      navigate(`/verify/${quickVerifyToken.trim()}`);
    } else {
      navigate('/verify');
    }
  };

  const faqs = [
    {
      q: 'What is APAAR ID and why is it essential for AICTE institutions?',
      a: 'APAAR (Automated Permanent Academic Account Registry), known as "One Nation One Student ID", is a 12-digit lifelong academic identifier created under the National Education Policy (NEP) 2020. AICTE mandates APAAR integration to detect duplicates across institutions, track seat intake compliance, and support portable digital credentials.',
    },
    {
      q: 'How does the Dynamic Seat-Compliance Ledger prevent excess admissions?',
      a: 'The system continuously cross-checks incoming admitted students against approved intake quotas per branch and category (General, EWS, SC, ST, OBC, and Supernumerary). If an institution enters student #121 for a 120-seat program, a real-time warning is triggered and flagged on the AICTE national intelligence board.',
    },
    {
      q: 'Can students directly edit or verify their official academic records?',
      a: 'No. To maintain strict data integrity, students have read-only transparency access. If an error is spotted (such as a date-of-birth discrepancy), students submit a formal Correction Request to their institution, accompanied by supporting certificates. Only authorized institutional registrars can approve changes.',
    },
    {
      q: 'What is the Verified Academic Passport and how does it protect student privacy?',
      a: 'The Verified Academic Passport allows students to generate time-limited (1h / 24h / 7d) sharing links and QR codes for employers. Students selectively toggle which fields to share, and recruiters only see verified badges with verification source timestamps without accessing sensitive personal records.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PrototypeBanner />
      <Header onOpenLoginModal={() => setLoginModalOpen(true)} />

      {/* Accessible Announcements Ticker / Notice Bar */}
      <section aria-label="Official Announcements" className="bg-gov-navy-950 text-white text-xs py-2 px-4 border-b border-gov-navy-800">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-gov-saffron-400 bg-gov-navy-900 px-2.5 py-0.5 rounded border border-gov-saffron-500/30 shrink-0">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>Notices</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap text-slate-200 text-xs">
            <span className="inline-block animate-marquee">
              [Circular 2026/04]: All AICTE-approved engineering institutions must complete APAAR student reconciliation before the upcoming seat-matrix freeze • [AICTE Guidelines]: Supernumerary PMSSS and TFW seats must be tracked separately from sanctioned general intake.
            </span>
          </div>
        </div>
      </section>

      {/* Main Hero Section */}
      <section aria-label="Portal Introduction" className="relative bg-gradient-to-b from-white via-gov-navy-50/40 to-slate-100 py-12 lg:py-20 border-b border-slate-200 overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Shield className="w-[600px] h-[600px] text-gov-navy-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gov-saffron-100 text-gov-saffron-900 border border-gov-saffron-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-gov-saffron-600" />
                <span>Smart India Hackathon 2026 • Problem Statement 26263 (AICTE)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gov-navy-900 tracking-tight leading-tight">
                APAAR-Based Student Data Management & Verification Platform
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                A unified, government-grade platform for AICTE-approved institutions to upload batch admission records, monitor approved intake in real time, reconcile discrepancies with DigiLocker, and empower students with privacy-first Verified Academic Passports.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-gov-saffron-400" />
                  <span>Enter Portal with Demo Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/verify"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-sm shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Verify a Student Passport</span>
                </Link>
              </div>

              {/* Fast verification input widget */}
              <form onSubmit={handleQuickVerifySubmit} className="pt-3 max-w-lg">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Have a Verified Academic Passport Token or URL?
                </label>
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-300 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200">
                  <Search className="w-4 h-4 text-slate-400 ml-2" />
                  <input
                    type="text"
                    value={quickVerifyToken}
                    onChange={(e) => setQuickVerifyToken(e.target.value)}
                    placeholder="e.g. rohit-iitd-verified-token"
                    className="w-full text-xs font-mono px-2 py-1 outline-hidden bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Inspect
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Synthetic KPI Card Showcase */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gov-saffron-500" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      National AICTE Live Telemetry
                    </span>
                  </div>
                  <SimulatedBadge size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gov-navy-50/70 p-3.5 rounded-xl border border-gov-navy-100">
                    <p className="text-[11px] font-semibold text-slate-600 uppercase">Institutions Tracked</p>
                    <p className="text-2xl font-black text-gov-navy-900 mt-1">10,480+</p>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> 100% Mandated
                    </span>
                  </div>

                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                    <p className="text-[11px] font-semibold text-slate-600 uppercase">APAAR Accounts Synced</p>
                    <p className="text-2xl font-black text-emerald-900 mt-1">3.42 M</p>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                      +14.2% this quarter
                    </span>
                  </div>

                  <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
                    <p className="text-[11px] font-semibold text-slate-600 uppercase">Seat Compliance Rate</p>
                    <p className="text-2xl font-black text-blue-900 mt-1">99.4%</p>
                    <span className="text-[10px] text-blue-700 font-semibold mt-0.5 block">
                      Dynamic quota tracking
                    </span>
                  </div>

                  <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100">
                    <p className="text-[11px] font-semibold text-slate-600 uppercase">Anomalies Detected</p>
                    <p className="text-2xl font-black text-amber-900 mt-1">1,482</p>
                    <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                      Duplicates & mismatches
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between text-slate-600">
                  <span>Simulated reference source:</span>
                  <span className="font-semibold text-gov-navy-900">DigiLocker / ABC API v2.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Innovations (From Hackathon Problem Statement & Project Report) */}
      <section aria-label="Core Architectural Innovations" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-gov-saffron-600 bg-gov-saffron-50 px-3 py-1 rounded-full border border-gov-saffron-200">
              Breakthrough Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy-900 mt-3">
              Four Core Architectural Innovations
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Engineered specifically to solve the institutional reporting bottleneck, duplicate enrollment fraud, and unverified credentials in campus hiring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-gov-navy-300 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-gov-navy-100 text-gov-navy-800 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-saffron-600 bg-gov-saffron-50 px-2 py-0.5 rounded border border-gov-saffron-200">
                Innovation #1
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2 mb-2">
                Dynamic Seat-Compliance Ledger
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Real-time tracking of sanctioned vs actual admissions. Separates supernumerary quotas (TFW, PMSSS) and fires instant alarms on excess admission breaches.
              </p>
              <button
                type="button"
                onClick={() => handleRoleQuickEntry(DEMO_USERS[1])}
                className="text-xs font-bold text-gov-navy-700 hover:text-gov-navy-900 flex items-center gap-1"
              >
                <span>Inspect Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-gov-navy-300 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <GitCompare className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Innovation #2
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2 mb-2">
                APAAR Data Reconciliation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Multi-pass validation checking missing 12-digit IDs, cross-institution duplicate clusters, and field-level discrepancies against DigiLocker/ABC records.
              </p>
              <button
                type="button"
                onClick={() => handleRoleQuickEntry(DEMO_USERS[1])}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <span>View Reconciliation Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-gov-navy-300 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Innovation #3
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2 mb-2">
                Student Transparency Portal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Students track record status, read plain-language flag explanations, and request corrections. Strict guard: students can never edit or verify official records.
              </p>
              <button
                type="button"
                onClick={() => handleRoleQuickEntry(DEMO_USERS[2])}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>Test Student Transparency</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-gov-navy-300 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Innovation #4
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2 mb-2">
                Verified Academic Passport
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Time-limited, revocable sharing links and dynamic QR codes. Recruiter views display verified vs pending vs unverified badges with full audit trail logging.
              </p>
              <Link
                to="/verify/rohit-iitd-verified-token"
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
              >
                <span>Simulate Recruiter View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stepper: How It Works */}
      <section aria-label="Workflow Guide" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
              End-To-End Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy-900 mt-2">
              How the Ecosystem Interacts
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Seamless 4-step lifecycle connecting Colleges, Regulators, Students, and Industry Verifiers.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-full bg-gov-navy-600 text-white font-black text-sm flex items-center justify-center mb-3">
                1
              </span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Batch Enrolment Upload</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Institutions ingest CSV/Excel records. System validates 12-digit APAAR schemas, required fields, and category quotas.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center mb-3">
                2
              </span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Reconciliation & Ledger</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Records are matched against DigiLocker/ABC. Seat tallies update dynamically, flagging excess admissions or duplicate IDs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-3">
                3
              </span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Student Transparency</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students review verification status and submit correction requests to institutions. No direct editing allowed.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center mb-3">
                4
              </span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Passport Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students generate temporary tokenized QR links. Employers inspect verified badges, creating tamper-evident audit records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards with 1-Click Access for Judges */}
      <section aria-label="Role Access" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-wider text-gov-navy-600 bg-gov-navy-50 px-3 py-1 rounded-full border border-gov-navy-200">
              Evaluator Quick Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy-900 mt-3">
              One-Click Role Switcher for Hackathon Judges
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Select any stakeholder profile to immediately launch into their dedicated role-protected workspace.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Institution Card */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/50 to-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Institution Admin</h4>
                <p className="text-xs text-slate-500 font-medium mb-3">IIT Delhi Nodal Office</p>
                <ul className="text-xs text-slate-600 space-y-1.5 mb-6">
                  <li className="flex items-center gap-1.5">• Batch CSV/Excel upload</li>
                  <li className="flex items-center gap-1.5">• Inline error correction</li>
                  <li className="flex items-center gap-1.5">• Corrections queue review</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleRoleQuickEntry(DEMO_USERS[0])}
                className="w-full py-2.5 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Institution Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* AICTE Card */}
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/50 to-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">AICTE Official</h4>
                <p className="text-xs text-slate-500 font-medium mb-3">Director of Approvals</p>
                <ul className="text-xs text-slate-600 space-y-1.5 mb-6">
                  <li className="flex items-center gap-1.5">• Dynamic Seat-Compliance Ledger</li>
                  <li className="flex items-center gap-1.5">• APAAR Data Reconciliation</li>
                  <li className="flex items-center gap-1.5">• Excess admission alarm trigger</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleRoleQuickEntry(DEMO_USERS[1])}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch AICTE Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Student Card */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Student Portal</h4>
                <p className="text-xs text-slate-500 font-medium mb-3">Rohit Sharma & Priya Verma</p>
                <ul className="text-xs text-slate-600 space-y-1.5 mb-6">
                  <li className="flex items-center gap-1.5">• View record verification status</li>
                  <li className="flex items-center gap-1.5">• Request corrections to college</li>
                  <li className="flex items-center gap-1.5">• Generate QR Academic Passport</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleRoleQuickEntry(DEMO_USERS[2])}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recruiter Card */}
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/50 to-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Authorized Verifier</h4>
                <p className="text-xs text-slate-500 font-medium mb-3">TCS University Talent</p>
                <ul className="text-xs text-slate-600 space-y-1.5 mb-6">
                  <li className="flex items-center gap-1.5">• Inspect shared student profiles</li>
                  <li className="flex items-center gap-1.5">• Distinguish Verified vs Unverified</li>
                  <li className="flex items-center gap-1.5">• Automatic audit log registration</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleRoleQuickEntry(DEMO_USERS[4])}
                className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Verifier Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section aria-label="Frequently Asked Questions" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gov-navy-900">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Guidelines regarding APAAR ID verification, AICTE compliance, and student data protection.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gov-saffron-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <DemoGuide />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};
