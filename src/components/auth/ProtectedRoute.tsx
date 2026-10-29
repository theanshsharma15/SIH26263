import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, Building2, Shield, GraduationCap, FileCheck2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import { DEMO_USERS } from '../../data/seed';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, login } = useAppStore();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Find the relevant demo user for one of the allowed roles
    const suggestedUser = DEMO_USERS.find((u) => allowedRoles.includes(u.role)) || DEMO_USERS[0];

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 mb-2">
            Error 403: Role Access Restricted
          </span>

          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Unauthorized Clearance Level
          </h2>

          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Your current active session is authenticated as{' '}
            <strong className="text-slate-800 uppercase font-mono">{currentUser.role}</strong> ({currentUser.name}).
            This government portal sector is exclusively designated for{' '}
            <strong className="text-gov-navy-800">{allowedRoles.join(' / ').toUpperCase()}</strong>.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => login(suggestedUser)}
              className="w-full py-2.5 px-4 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-gov-saffron-400" />
              <span>Switch to {suggestedUser.name} ({suggestedUser.role})</span>
            </button>

            <Link
              to="/"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
