import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Shield,
  Download,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { formatDateTime } from '../../utils/formatters';

export const AicteAuditLogsPage: React.FC = () => {
  const { auditLogs } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedRole !== 'ALL' && log.actorRole !== selectedRole) return false;
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
  }, [auditLogs, selectedRole, selectedAction, searchQuery]);

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
      case 'PASSPORT_GENERATED':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'PASSPORT_VERIFIED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SIMULATE_ADMISSION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              National Security Audit Command
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Centralized AICTE Cross-System Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time immutable ledger capturing all batch uploads, unmaskings, passport verifications, and approvals.
          </p>
        </div>

        <div className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-700 border">
          {filteredLogs.length} Events Recorded
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, target, IP..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-purple-400 outline-hidden bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-purple-400 outline-hidden font-medium"
          >
            <option value="ALL">All Stakeholder Roles</option>
            <option value="aicte">AICTE Officials</option>
            <option value="institution">Institutions</option>
            <option value="student">Students</option>
            <option value="recruiter">Recruiters / Verifiers</option>
          </select>
        </div>

        <div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-purple-400 outline-hidden font-medium"
          >
            <option value="ALL">All Event Types</option>
            <option value="UPLOAD_BATCH">UPLOAD_BATCH</option>
            <option value="REVEAL_APAAR">REVEAL_APAAR</option>
            <option value="CORRECTION_APPROVED">CORRECTION_APPROVED</option>
            <option value="PASSPORT_GENERATED">PASSPORT_GENERATED</option>
            <option value="PASSPORT_VERIFIED">PASSPORT_VERIFIED</option>
            <option value="SIMULATE_ADMISSION">SIMULATE_ADMISSION</option>
            <option value="FLAG_RESOLVED">FLAG_RESOLVED</option>
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
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">Audit Detail</th>
                <th className="p-3.5">Simulated IP</th>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
