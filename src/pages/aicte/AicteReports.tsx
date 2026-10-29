import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const AicteReports: React.FC = () => {
  const { institutions, courses, students, addAuditLog } = useAppStore();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadNationalReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'AICTE ID,Institution Name,State,Type,Total Approved Intake,Total Enrolled,Compliance Status\n';

    institutions.forEach((i) => {
      csvContent += `"${i.aicteId}","${i.name}","${i.state}","${i.type}",${i.totalIntake},${i.totalEnrolled},"${i.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_National_Compliance_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog(
      'REPORT_EXPORTED',
      'National AICTE Seat & APAAR Compliance Summary',
      'Generated national compliance extract for apex monitoring committee.'
    );

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Statutory Oversight Intelligence
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            AICTE National Compliance & Analytics Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate data extracts on institutional approvals, seat matrix violations, and APAAR verification quotas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadNationalReport}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-purple-200" />
            <span>Export National CSV</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">National Compliance Report exported successfully. Logged to central audit trail.</p>
        </div>
      )}

      {/* Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">
          Executive Summary: Institutional Intake vs Validated Enrolments
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b uppercase text-[10px]">
              <tr>
                <th className="p-3">AICTE ID</th>
                <th className="p-3">Institution Name</th>
                <th className="p-3">State</th>
                <th className="p-3 text-center">Approved Intake</th>
                <th className="p-3 text-center">Admitted</th>
                <th className="p-3 text-center">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{inst.aicteId}</td>
                  <td className="p-3 font-semibold text-slate-900">{inst.name}</td>
                  <td className="p-3 text-slate-600">{inst.state}</td>
                  <td className="p-3 text-center font-bold">{inst.totalIntake}</td>
                  <td className="p-3 text-center font-bold text-purple-900">{inst.totalEnrolled}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inst.status === 'ExcessEnrolment'
                        ? 'bg-rose-100 text-rose-800'
                        : inst.status === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {inst.status}
                    </span>
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
