import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  QrCode,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  Sparkles,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { PrototypeBanner } from '../../components/common/PrototypeBanner';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { DemoGuide } from '../../components/common/DemoGuide';

export const VerifyEntryPage: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const navigate = useNavigate();

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      navigate(`/verify/${tokenInput.trim()}`);
    }
  };

  const handleQuickDemoToken = (tok: string) => {
    navigate(`/verify/${tok}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <PrototypeBanner />
      <Header />

      <main id="main-content" className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <QrCode className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Academic Verification Gateway</span>
              <SimulatedBadge size="sm" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Verify an Academic Passport
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Employers, recruiters, and educational institutions can inspect time-bound, student-authorized verified credentials issued under the AICTE APAAR framework.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifySubmit} className="space-y-4 max-w-lg mx-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Enter Passport Verification Token or Sharing URL:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. rohit-iitd-verified-token"
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl font-mono text-xs border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Inspect Candidate Academic Record</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Shortcuts for Hackathon Judges */}
          <div className="pt-6 border-t border-slate-100 max-w-lg mx-auto space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Quick Test Credentials for Evaluators:
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickDemoToken('rohit-iitd-verified-token')}
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rohit Sharma (Active)</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Valid 24h Verified Token
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoToken('demo-expired-token')}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Test Expired Link</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Simulates expired state
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <DemoGuide />
    </div>
  );
};
