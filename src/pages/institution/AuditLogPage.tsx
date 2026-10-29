import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Shield,
  Download,
  Terminal,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { formatDateTime } from '../../utils/formatters';

export const AuditLogPage: React.FC = () => {
  const { auditLogs, currentUser, institutions } = useAppStore();
  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  // Filter logs related to institution
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedAction !== 'ALL' && log.action !== selectedAction) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.actorName.toLowerCase().includes(q) ||
          log.target.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [auditLogs, selectedAction, searchQuery]);

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'UPLOAD_BATCH':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REVEAL_APAAR':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CORRECTION_APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CORRECTION_REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'SIMULATE_ADMISSION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gov-navy-600 uppercase tracking-wider">
              Statutory Compliance & Security Trail
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Institutional Immutable Audit Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically timestamped event logging recording all uploads, APAAR reveals, and status revisions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, action..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-gov-navy-400 outline-hidden bg-slate-50/50"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-gov-navy-400 outline-hidden font-medium"
          >
            <option value="ALL">All Event Types</option>
            <option value="UPLOAD_BATCH">Batch Ingestion (UPLOAD_BATCH)</option>
            <option value="REVEAL_APAAR">Identifier Unmasking (REVEAL_APAAR)</option>
            <option value="CORRECTION_APPROVED">Correction Approved</option>
            <option value="CORRECTION_REJECTED">Correction Rejected</option>
            <option value="PASSPORT_VERIFIED">Passport Verified</option>
            <option value="SIMULATE_ADMISSION">Simulated Admission</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor (Role)</th>
                <th className="p-3.5">Action Type</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">Operational Details</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>

                  <td className="p-3.5 text-slate-900 font-sans">
                    <span className="font-bold">{log.actorName}</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-mono">
                      [{log.actorRole}]
                    </span>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-slate-800 font-sans max-w-xs truncate" title={log.target}>
                    {log.target}
                  </td>

                  <td className="p-3.5 text-slate-600 font-sans max-w-md">
                    {log.details}
                  </td>

                  <td className="p-3.5 text-slate-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                    No audit records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
