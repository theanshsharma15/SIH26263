import React, { useState } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { StatusBadge } from '../../components/common/StatusBadge';

export const InstitutionsList: React.FC = () => {
  const { institutions, courses } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInstitutions = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.aicteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              National Institute Registry
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            AICTE-Approved Technical Institutions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Directory of approved institutes, approved program intake ceilings, and compliance status.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by institute name, AICTE ID, or state..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-purple-400 outline-hidden bg-slate-50/50"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInstitutions.map((inst) => {
          const instCourses = courses.filter((c) => c.institutionId === inst.id);
          const hasExcess = instCourses.some((c) => c.actualEnrolled > c.approvedIntake);

          return (
            <div
              key={inst.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-card ${
                hasExcess ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    AICTE: {inst.aicteId}
                  </span>
                  <StatusBadge status={inst.status} />
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {inst.name}
                </h3>

                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{inst.city}, {inst.state} ({inst.type})</span>
                </p>

                <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Sanctioned Intake</span>
                    <span className="text-base font-black text-slate-800">{inst.totalIntake}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Validated Admissions</span>
                    <span className={`text-base font-black ${hasExcess ? 'text-rose-600' : 'text-slate-800'}`}>
                      {inst.totalEnrolled}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1">
                  <p className="truncate">
                    <span className="font-semibold text-slate-800">Email: </span>
                    {inst.contactEmail}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Programs: </span>
                    {instCourses.length} Approved Branches
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <span className="text-xs text-purple-700 font-bold block">
                  {hasExcess ? 'Warning: Intake ceiling exceeded in 1 branch' : 'All branch seat quotas compliant'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
