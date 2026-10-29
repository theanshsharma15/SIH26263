import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Layers,
  UploadCloud,
  FileEdit,
  ArrowRight,
  TrendingUp,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { KpiCard } from '../../components/common/KpiCard';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

export const InstitutionDashboard: React.FC = () => {
  const { currentUser, institutions, courses, students, corrections, auditLogs } = useAppStore();

  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];
  const instCourses = courses.filter((c) => c.institutionId === currentInst.id);
  const instStudents = students.filter((s) => s.institutionId === currentInst.id);

  const totalEnrolled = instStudents.length;
  const verifiedCount = instStudents.filter((s) => s.status === 'Verified').length;
  const flaggedCount = instStudents.filter((s) => s.status === 'Flagged' || s.status === 'NeedsCorrection').length;
  const totalApprovedIntake = instCourses.reduce((sum, c) => sum + c.approvedIntake, 0);
  const intakeUtilPct = totalApprovedIntake > 0 ? ((totalEnrolled / totalApprovedIntake) * 100).toFixed(1) : '0';

  const pendingCorrections = corrections.filter(
    (c) => c.institutionId === currentInst.id && c.status === 'Requested'
  );

  // Chart data
  const chartData = instCourses.map((c) => ({
    name: c.courseCode,
    fullName: c.courseName,
    Approved: c.approvedIntake,
    Enrolled: c.actualEnrolled,
  }));

  // Recent institutional audit activities
  const recentLogs = auditLogs
    .filter((l) => l.actorRole === 'institution' || l.details.includes(currentInst.name) || l.target.includes('inst-1'))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gov-navy-600 uppercase tracking-wider">
              {currentInst.type} Institution • AICTE ID: {currentInst.aicteId}
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {currentInst.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Academic Enrolment & APAAR Verification Management Center
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/institution/upload"
            className="px-4 py-2.5 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-gov-saffron-400" />
            <span>Upload New Batch</span>
          </Link>
          <Link
            to="/institution/seat-ledger"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Seat Ledger
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Admissions"
          value={totalEnrolled}
          subtitle={`Across ${instCourses.length} active programs`}
          icon={Users}
          variant="info"
        />

        <KpiCard
          title="Verified Records"
          value={verifiedCount}
          subtitle={`${((verifiedCount / (totalEnrolled || 1)) * 100).toFixed(0)}% verified with APAAR & ABC`}
          icon={CheckCircle2}
          variant="success"
        />

        <KpiCard
          title="Flagged / Pending Action"
          value={flaggedCount}
          subtitle={`${pendingCorrections.length} correction requests pending`}
          icon={AlertTriangle}
          variant={flaggedCount > 0 ? 'warning' : 'default'}
        />

        <KpiCard
          title="Intake Utilization"
          value={`${intakeUtilPct}%`}
          subtitle={`${totalEnrolled} / ${totalApprovedIntake} sanctioned seats`}
          icon={Layers}
          variant={Number(intakeUtilPct) > 100 ? 'danger' : 'default'}
        />
      </div>

      {/* Quick Action Alert if issues exist */}
      {flaggedCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm">Action Required: {flaggedCount} Records Require Rectification</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Records contain missing APAAR identifiers, duplicate IDs, or birth date mismatches with the national registry.
              </p>
            </div>
          </div>
          <Link
            to="/institution/issues"
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shrink-0 transition-colors"
          >
            Inspect & Fix Anomalies
          </Link>
        </div>
      )}

      {/* Charts and Activity Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Course-Wise Intake vs Enrolment Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Course-Wise Approved vs Enrolled Seats</h3>
              <p className="text-xs text-slate-500">Live monitoring of sanctioned AICTE intake ceilings</p>
            </div>
            <Link to="/institution/seat-ledger" className="text-xs font-bold text-gov-navy-600 hover:underline">
              View Detailed Ledger
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B2A5B', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Approved" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Sanctioned Intake" />
                <Bar dataKey="Enrolled" fill="#0B2A5B" radius={[4, 4, 0, 0]} name="Admitted Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Trail */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Institution Audit Trail</h3>
                <p className="text-xs text-slate-500">Tamper-evident logs of institutional actions</p>
              </div>
              <Link to="/institution/audit-log" className="text-xs font-bold text-gov-navy-600 hover:underline">
                Full Log
              </Link>
            </div>

            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-800 truncate">{log.target}</span>
                    <span className="text-[10px] text-slate-600 shrink-0 font-medium">{formatDateTime(log.timestamp)}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/institution/records"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore All Student Records ({totalEnrolled})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
