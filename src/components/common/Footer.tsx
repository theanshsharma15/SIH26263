import React from 'react';
import { Shield, ExternalLink, Heart, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gov-navy-900 text-slate-300 text-xs border-t-4 border-gov-saffron-500 mt-auto">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-gov-navy-800">
        <div>
          <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-gov-saffron-400" />
            <span>AICTE Portals</span>
          </h4>
          <ul className="space-y-2 text-slate-300">
            <li>
              <a href="https://aicte-india.org" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                <span>AICTE Main Web Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="https://apaar.education.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                <span>APAAR / EduLocker Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="https://www.abc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                <span>Academic Bank of Credits (ABC)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Key Platform Modules</h4>
          <ul className="space-y-2 text-slate-300">
            <li><Link to="/institution/dashboard" className="hover:text-white">Institution Enrolment Manager</Link></li>
            <li><Link to="/aicte/seat-ledger" className="hover:text-white">Dynamic Seat-Compliance Ledger</Link></li>
            <li><Link to="/aicte/reconciliation" className="hover:text-white">APAAR Data Reconciliation</Link></li>
            <li><Link to="/student/my-record" className="hover:text-white">Student Transparency Portal</Link></li>
            <li><Link to="/verify" className="hover:text-white">Academic Passport Verification</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Policies & Compliance</h4>
          <ul className="space-y-2 text-slate-300">
            <li><a href="#privacy" className="hover:text-white">Privacy Policy & Consent Framework</a></li>
            <li><a href="#terms" className="hover:text-white">Terms of Record Verification</a></li>
            <li><a href="#accessibility" className="hover:text-white">GIGW & WCAG 2.1 AA Statement</a></li>
            <li><a href="#hyperlinking" className="hover:text-white">Hyperlinking Policy</a></li>
            <li><a href="#copyright" className="hover:text-white">Copyright & Disclaimer Notice</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Helpdesk & Support</h4>
          <div className="space-y-2 text-slate-300">
            <p className="font-medium text-white">AICTE National Technical Helpdesk</p>
            <p>Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</p>
            <p className="text-gov-saffron-300 font-semibold">Toll Free: 1800-11-2244</p>
            <p>Email: apaar-support@aicte-india.org</p>
          </div>
        </div>
      </div>

      {/* Standards & GIGW Bottom Strip */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-slate-300">
            Website Content Owned and Maintained by All India Council for Technical Education (AICTE).
          </p>
          <p className="text-[11px] text-amber-300/90 font-medium">
            * Prototype Developed for Smart India Hackathon 2026 (Problem Statement 26263). All institutional and student records are synthetic simulations.
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-300 shrink-0">
          <span className="px-2 py-1 bg-gov-navy-800 rounded border border-gov-navy-700">
            GIGW 3.0 Compliant
          </span>
          <span className="px-2 py-1 bg-gov-navy-800 rounded border border-gov-navy-700">
            WCAG 2.1 Level AA
          </span>
          <span>Last Updated: 30 Oct 2026</span>
        </div>
      </div>
    </footer>
  );
};
