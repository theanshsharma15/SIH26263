import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  ShieldCheck,
  History,
  Info,
} from 'lucide-react';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const ConsentManager: React.FC = () => {
  const [consentAcademic, setConsentAcademic] = useState(true);
  const [consentQualifications, setConsentQualifications] = useState(true);
  const [consentContact, setConsentContact] = useState(false);
  const [consentAadhaarSync, setConsentAadhaarSync] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              DPDP Act & Digital Consent Framework
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Student Data Consent & Privacy Preferences
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Granular privacy toggles governing automated academic record sharing and verifier access.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          Save Consent Settings
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">Consent preferences updated and synchronized with DigiLocker consent registry.</p>
        </div>
      )}

      {/* Consent Toggles */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h3 className="font-extrabold text-sm text-slate-900 border-b pb-3">
          Category-Level Consent Permissions
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-xs text-slate-900">Academic Transcript & CGPA</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Allows authorized campus recruiters to view semester CGPA and backlog counts.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consentAcademic}
              onChange={(e) => setConsentAcademic(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-xs text-slate-900">Board Exam & Entrance Test Qualifications</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Allows verified recruiters to cross-check 10th, 12th scores and JEE rank via DigiLocker.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consentQualifications}
              onChange={(e) => setConsentQualifications(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-xs text-slate-900">Personal Contact Information (Phone / Email)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Mask personal mobile number and private email address on all external passport links.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consentContact}
              onChange={(e) => setConsentContact(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-xs text-slate-900">Academic Bank of Credits (ABC) Auto-Sync</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Permit AICTE to automatically synchronize awarded academic credits into your national ABC locker.
              </p>
            </div>
            <input
              type="checkbox"
              checked={consentAadhaarSync}
              onChange={(e) => setConsentAadhaarSync(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
