import React from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  QrCode,
  Clock,
  Eye,
  XCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { formatDateTime, getTimeRemaining } from '../../utils/formatters';

export const SharingHistory: React.FC = () => {
  const { passports, revokePassport, students, currentUser } = useAppStore();
  const currentStudent = students.find((s) => s.apaarId === currentUser?.apaarId) || students[0];

  const studentPassports = passports.filter((p) => p.studentId === currentStudent.id);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Student Privacy & Access Control Trail
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Passport Sharing & Access Audit History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking of which recruiters and companies accessed your verified credentials.
          </p>
        </div>

        <Link
          to="/student/passport"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>Create New Passport</span>
        </Link>
      </div>

      {/* Passports List */}
      <div className="space-y-4">
        {studentPassports.map((pass) => {
          const timer = getTimeRemaining(pass.expiresAt);
          const isInvalid = pass.isRevoked || timer.isExpired;

          return (
            <div
              key={pass.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 transition-all ${
                isInvalid ? 'border-slate-200 opacity-75' : 'border-emerald-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Shared with: {pass.recipientOrganization || 'Authorized Employer'}
                    </h3>
                    {pass.recipientName && (
                      <span className="text-xs text-slate-500 font-medium">({pass.recipientName})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Token: {pass.token} • Created: {formatDateTime(pass.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {pass.isRevoked ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Revoked by Student
                    </span>
                  ) : timer.isExpired ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Expired
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timer.formatted}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Stats & Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Recruiter Access Count</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>{pass.viewsCount} View{pass.viewsCount !== 1 ? 's' : ''}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Last Accessed</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {pass.lastViewedAt ? formatDateTime(pass.lastViewedAt) : 'Not viewed yet'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Expiration Timestamp</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {formatDateTime(pass.expiresAt)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1">
                <a
                  href={`/verify/${pass.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-gov-navy-600 hover:text-gov-navy-800 flex items-center gap-1"
                >
                  <span>Open Verification Portal View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {!pass.isRevoked && !timer.isExpired && (
                  <button
                    type="button"
                    onClick={() => revokePassport(pass.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors border border-rose-200 flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Revoke Access Immediately</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {studentPassports.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No Shared Passports</h3>
            <p className="text-xs text-slate-500 mt-1">
              You haven&apos;t shared your Verified Academic Passport with any employers yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
