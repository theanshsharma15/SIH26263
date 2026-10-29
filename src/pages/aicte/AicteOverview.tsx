import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Building2,
  Users,
  AlertOctagon,
  Layers,
  TrendingUp,
  ArrowRight,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
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
  LineChart,
  Line,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { KpiCard } from '../../components/common/KpiCard';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const AicteOverview: React.FC = () => {
  const { institutions, courses, students } = useAppStore();

  const totalInstitutions = institutions.length;
  const totalStudents = students.length;
  const flaggedStudents = students.filter((s) => s.status === 'Flagged' || s.status === 'NeedsCorrection').length;
  const totalIntake = courses.reduce((sum, c) => sum + c.approvedIntake, 0);
  const totalEnrolled = courses.reduce((sum, c) => sum + c.actualEnrolled, 0);
  const excessCourses = courses.filter((c) => c.actualEnrolled > c.approvedIntake).length;

  const complianceRate = totalInstitutions > 0
    ? (((totalInstitutions - institutions.filter((i) => i.status === 'ExcessEnrolment').length) / totalInstitutions) * 100).toFixed(1)
    : '100';

  // Institution comparison chart data
  const instChartData = institutions.map((inst) => ({
    name: inst.shortName,
    Approved: inst.totalIntake,
    Enrolled: inst.totalEnrolled,
  }));

  // Enrolment timeline simulation
  const trendData = [
    { month: 'Jun', Admitted: 45 },
    { month: 'Jul', Admitted: 120 },
    { month: 'Aug', Admitted: 280 },
    { month: 'Sep', Admitted: totalEnrolled },
  ];

  const violatorInstitutions = institutions.filter((i) => i.status !== 'Compliant');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              National AICTE Regulatory Command Center
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            AICTE Central Intelligence & Compliance Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            National overview of approved technical institutions, APAAR verification, and seat-intake compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/aicte/seat-ledger"
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-purple-300" />
            <span>Dynamic Seat Ledger</span>
          </Link>
          <Link
            to="/aicte/reconciliation"
            className="px-4 py-2.5 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <GitCompare className="w-4 h-4 text-gov-saffron-400" />
            <span>Reconciliation Engine</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Monitored Institutions"
          value={totalInstitutions}
          subtitle="6 Autonomous & Central bodies"
          icon={Building2}
          variant="default"
        />

        <KpiCard
          title="Total Admitted Students"
          value={totalStudents}
          subtitle={`Across ${courses.length} accredited disciplines`}
          icon={Users}
          variant="info"
        />

        <KpiCard
          title="Active Flagged Cases"
          value={flaggedStudents}
          subtitle="Duplicates & data discrepancies"
          icon={AlertOctagon}
          variant={flaggedStudents > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          title="Seat Compliance Index"
          value={`${complianceRate}%`}
          subtitle={`${excessCourses} excess admission course detected`}
          icon={Shield}
          variant={Number(complianceRate) < 90 ? 'danger' : 'success'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Approved vs Enrolled per Institution */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Institution Intake Capacity vs. Validated Admissions
              </h3>
              <p className="text-xs text-slate-500">
                Comparative analysis of sanctioned intake ceiling across monitored colleges
              </p>
            </div>
            <Link to="/aicte/institutions" className="text-xs font-bold text-purple-700 hover:underline">
              All Institutions
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2E1065', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Approved" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Sanctioned Intake" />
                <Bar dataKey="Enrolled" fill="#6B21A8" radius={[4, 4, 0, 0]} name="Validated Admissions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Violations / Notice Board */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                Compliance Watchlist
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                Action Required
              </span>
            </div>

            <div className="space-y-3">
              {violatorInstitutions.map((inst) => (
                <div key={inst.id} className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{inst.shortName}</span>
                    <span className="text-[10px] font-bold text-rose-700 uppercase">{inst.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Admissions: <strong className="text-rose-700">{inst.totalEnrolled}</strong> / Approved: {inst.totalIntake}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Violation: Exceeded sanctioned intake in B.Tech Electrical by 1 seat.
                  </p>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">CEG Anna Univ</span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Warning (Near Capacity)</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Admissions: 318 / Approved: 320 (Only 2 seats remaining)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/aicte/seat-ledger"
              className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Dynamic Seat Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
