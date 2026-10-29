import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { PrototypeBanner } from '../../components/common/PrototypeBanner';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PrototypeBanner />
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-slate-100 text-gov-navy-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <ShieldAlert className="w-8 h-8 text-gov-saffron-600" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700 mb-2">
            Error 404: Page Not Found
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Requested Resource Unavailable
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            The URL requested could not be located in the central APAAR registry portal schema.
          </p>
          <Link
            to="/"
            className="w-full py-2.5 px-4 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Portal Homepage</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
