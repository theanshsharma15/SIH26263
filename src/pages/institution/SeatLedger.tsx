import React from 'react';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  AlertOctagon,
  Users,
  Shield,
  Info,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

export const SeatLedger: React.FC = () => {
  const { currentUser, courses, institutions } = useAppStore();
  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];
  const instCourses = courses.filter((c) => c.institutionId === currentInst.id);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gov-navy-600 uppercase tracking-wider">
              AICTE Sanctioned Quota Compliance
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Institutional Seat Compliance & Intake Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time reconciliation of approved AICTE intake ceilings against actual validated admissions.
          </p>
        </div>
      </div>

      {/* Course Ledgers */}
      <div className="space-y-5">
        {instCourses.map((course) => {
          const filled = course.actualEnrolled;
          const approved = course.approvedIntake;
          const remaining = Math.max(0, approved - filled);
          const excess = Math.max(0, filled - approved);
          const percent = Math.min(100, Math.round((filled / approved) * 100));

          const isNearCapacity = remaining <= 2 && remaining > 0;
          const isAtCapacity = remaining === 0 && excess === 0;
          const isExcess = excess > 0;

          return (
            <div
              key={course.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                isExcess
                  ? 'border-rose-400 bg-rose-50/20'
                  : isNearCapacity
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-gov-navy-100 text-gov-navy-900">
                      {course.courseCode}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {course.courseName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Degree Level: {course.degreeLevel} • Institution AICTE ID: {currentInst.aicteId}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isExcess ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white animate-pulse">
                      <AlertOctagon className="w-4 h-4" />
                      <span>Excess Admission Violation ({excess} seats over limit!)</span>
                    </span>
                  ) : isNearCapacity ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Near Capacity Warning (Only {remaining} seat{remaining > 1 ? 's' : ''} left!)</span>
                    </span>
                  ) : isAtCapacity ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-white">
                      <span>100% Filled (0 Seats Left)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Compliant ({remaining} Seats Remaining)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress gauge */}
              <div className="space-y-1.5 mb-5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">
                    Admitted: {filled} / Approved: {approved}
                  </span>
                  <span className={isExcess ? 'text-rose-600' : 'text-slate-900'}>
                    {percent}% Filled
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, (filled / approved) * 100)}%` }}
                    className={`h-full transition-all duration-500 rounded-full ${
                      isExcess
                        ? 'bg-rose-600'
                        : isNearCapacity
                        ? 'bg-amber-500'
                        : 'bg-gov-navy-600'
                    }`}
                  />
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Category Quota</th>
                      <th className="p-2.5 text-center">Sanctioned Intake</th>
                      <th className="p-2.5 text-center">Actual Enrolled</th>
                      <th className="p-2.5 text-center">Remaining Seats</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 font-medium">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">General (Open)</td>
                      <td className="p-2.5 text-center">{course.categoryBreakdown.general}</td>
                      <td className="p-2.5 text-center font-bold text-gov-navy-800">{course.enrolledByCategory.general}</td>
                      <td className="p-2.5 text-center">{Math.max(0, course.categoryBreakdown.general - course.enrolledByCategory.general)}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold">Compliant</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">OBC (Non-Creamy)</td>
                      <td className="p-2.5 text-center">{course.categoryBreakdown.obc}</td>
                      <td className="p-2.5 text-center font-bold text-gov-navy-800">{course.enrolledByCategory.obc}</td>
                      <td className="p-2.5 text-center">{Math.max(0, course.categoryBreakdown.obc - course.enrolledByCategory.obc)}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold">Compliant</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">SC (Scheduled Caste)</td>
                      <td className="p-2.5 text-center">{course.categoryBreakdown.sc}</td>
                      <td className="p-2.5 text-center font-bold text-gov-navy-800">{course.enrolledByCategory.sc}</td>
                      <td className="p-2.5 text-center">{Math.max(0, course.categoryBreakdown.sc - course.enrolledByCategory.sc)}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold">Compliant</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">ST (Scheduled Tribe)</td>
                      <td className="p-2.5 text-center">{course.categoryBreakdown.st}</td>
                      <td className="p-2.5 text-center font-bold text-gov-navy-800">{course.enrolledByCategory.st}</td>
                      <td className="p-2.5 text-center">{Math.max(0, course.categoryBreakdown.st - course.enrolledByCategory.st)}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold">Compliant</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">EWS (Economically Weaker)</td>
                      <td className="p-2.5 text-center">{course.categoryBreakdown.ews}</td>
                      <td className="p-2.5 text-center font-bold text-gov-navy-800">{course.enrolledByCategory.ews}</td>
                      <td className="p-2.5 text-center">{Math.max(0, course.categoryBreakdown.ews - course.enrolledByCategory.ews)}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[11px] text-emerald-700 font-semibold">Compliant</span>
                      </td>
                    </tr>
                    <tr className="bg-purple-50/50">
                      <td className="p-2.5 font-bold text-purple-900 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Supernumerary (TFW / PMSSS / J&K)</span>
                      </td>
                      <td className="p-2.5 text-center text-purple-900">{course.categoryBreakdown.supernumerary}</td>
                      <td className="p-2.5 text-center font-bold text-purple-950">{course.enrolledByCategory.supernumerary}</td>
                      <td className="p-2.5 text-center text-purple-900">{Math.max(0, course.categoryBreakdown.supernumerary - course.enrolledByCategory.supernumerary)}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          Tracked Separately
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
