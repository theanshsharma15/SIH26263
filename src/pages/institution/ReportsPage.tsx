import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileCheck,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const ReportsPage: React.FC = () => {
  const { currentUser, institutions, courses, students, addAuditLog } = useAppStore();
  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];
  const instStudents = students.filter((s) => s.institutionId === currentInst.id);
  const instCourses = courses.filter((c) => c.institutionId === currentInst.id);

  const [selectedReportType, setSelectedReportType] = useState('enrolment_summary');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (selectedReportType === 'enrolment_summary') {
      csvContent += 'Course Code,Course Name,Degree Level,Approved Intake,Actual Enrolled,Remaining Seats,Status\n';
      instCourses.forEach((c) => {
        const rem = Math.max(0, c.approvedIntake - c.actualEnrolled);
        const status = c.actualEnrolled > c.approvedIntake ? 'Excess Admission' : rem <= 2 ? 'Near Capacity' : 'Normal';
        csvContent += `"${c.courseCode}","${c.courseName}","${c.degreeLevel}",${c.approvedIntake},${c.actualEnrolled},${rem},"${status}"\n`;
      });
    } else {
      csvContent += 'Student Name,APAAR ID,Program,Seat Category,Date of Birth,Status,CGPA\n';
      instStudents.forEach((s) => {
        csvContent += `"${s.fullName}","${s.apaarId}","${s.courseId}","${s.seatCategory}","${s.dateOfBirth}","${s.status}",${s.academicRecord.cgpa || 'N/A'}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentInst.shortName}_${selectedReportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog(
      'REPORT_EXPORTED',
      `Report: ${selectedReportType}`,
      `Exported official institutional compliance report for ${currentInst.name}.`
    );

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gov-navy-600 uppercase tracking-wider">
              Statutory Documentation & Reporting
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Institutional AICTE Compliance Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate and export official admission registries, seat utilization manifests, and audit extracts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-4 py-2 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-gov-saffron-400" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">Report successfully generated and exported. Activity logged to Audit Trail.</p>
        </div>
      )}

      {/* Report Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">Select Report Type:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedReportType('enrolment_summary')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedReportType === 'enrolment_summary'
                ? 'border-gov-navy-600 bg-gov-navy-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-slate-900 text-xs sm:text-sm">
              Approved Intake vs. Enrolment Seat Manifest
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Course-wise breakdown with category quotas, remaining seats, and capacity compliance status.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedReportType('student_registry')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedReportType === 'student_registry'
                ? 'border-gov-navy-600 bg-gov-navy-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-slate-900 text-xs sm:text-sm">
              Comprehensive APAAR Student Verification Registry
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Complete nominal roll of all enrolled candidates with verification status, CGPA, and admission dates.
            </p>
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Document Preview</h3>
            <p className="text-xs text-slate-500">Government format preview prior to statutory export</p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Ref: AICTE-REP-{Date.now().toString().slice(-6)}</span>
        </div>

        {selectedReportType === 'enrolment_summary' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b uppercase text-[10px]">
                <tr>
                  <th className="p-3">Program Code</th>
                  <th className="p-3">Program Name</th>
                  <th className="p-3 text-center">Approved Intake</th>
                  <th className="p-3 text-center">Actual Admissions</th>
                  <th className="p-3 text-center">Remaining Seats</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {instCourses.map((c) => {
                  const rem = Math.max(0, c.approvedIntake - c.actualEnrolled);
                  const isExcess = c.actualEnrolled > c.approvedIntake;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 font-mono">{c.courseCode}</td>
                      <td className="p-3 text-slate-700">{c.courseName}</td>
                      <td className="p-3 text-center font-bold text-slate-700">{c.approvedIntake}</td>
                      <td className="p-3 text-center font-bold text-gov-navy-800">{c.actualEnrolled}</td>
                      <td className="p-3 text-center font-semibold text-slate-700">{rem}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isExcess ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isExcess ? 'Excess Admission!' : 'Compliant'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b uppercase text-[10px]">
                <tr>
                  <th className="p-3">Candidate Name</th>
                  <th className="p-3">APAAR ID</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Quota</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {instStudents.slice(0, 15).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{s.fullName}</td>
                    <td className="p-3 font-mono text-slate-600">{s.apaarId || '[Missing]'}</td>
                    <td className="p-3 font-semibold text-slate-700">{s.courseId}</td>
                    <td className="p-3 text-slate-600">{s.seatCategory}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
