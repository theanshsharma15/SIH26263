import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  FileCheck,
  ShieldCheck,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  Award,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StudentRecord, VerificationStatus } from '../../types';
import { MaskedId } from '../../components/common/MaskedId';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';
import { formatDate } from '../../utils/formatters';

export const StudentRecords: React.FC = () => {
  const { currentUser, students, courses, institutions } = useAppStore();
  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];
  const instCourses = courses.filter((c) => c.institutionId === currentInst.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudentDrawer, setSelectedStudentDrawer] = useState<StudentRecord | null>(null);

  const pageSize = 12;

  // Filter students for current institution
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (s.institutionId !== currentInst.id) return false;

      if (selectedCourse !== 'ALL' && s.courseId !== selectedCourse) return false;
      if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
      if (selectedCategory !== 'ALL' && s.seatCategory !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.fullName.toLowerCase().includes(q);
        const matchesApaar = s.apaarId.toLowerCase().includes(q);
        const matchesEmail = s.email.toLowerCase().includes(q);
        return matchesName || matchesApaar || matchesEmail;
      }

      return true;
    });
  }, [students, currentInst.id, selectedCourse, selectedStatus, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getCourseName = (courseId: string) => {
    const c = courses.find((item) => item.id === courseId);
    return c ? `${c.courseCode}` : 'Engineering';
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gov-navy-600 uppercase tracking-wider">
              Central Student Registry
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Institutional Student Enrolment Records
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Master database of all enrolled students for {currentInst.shortName}. Showing {filteredStudents.length} candidates.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, APAAR..."
              className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-gov-navy-400 outline-hidden bg-slate-50/50"
            />
          </div>

          {/* Course filter */}
          <div>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Academic Program"
              className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-gov-navy-400 outline-hidden font-medium"
            >
              <option value="ALL">All Academic Programs</option>
              {instCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseCode} - {c.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Verification Status"
              className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-gov-navy-400 outline-hidden font-medium"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="Verified">Verified</option>
              <option value="NeedsCorrection">Needs Correction</option>
              <option value="Flagged">Flagged</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Seat Quota"
              className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 text-slate-700 bg-slate-50/50 focus:ring-2 focus:ring-gov-navy-400 outline-hidden font-medium"
            >
              <option value="ALL">All Seat Quotas</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
              <option value="Supernumerary">Supernumerary (TFW/PMSSS)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Student Details</th>
                <th className="p-3.5">APAAR Identifier (Click to Reveal)</th>
                <th className="p-3.5">Program</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Academics (CGPA)</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{s.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{s.email}</div>
                  </td>

                  <td className="p-3.5">
                    <MaskedId apaarId={s.apaarId} studentId={s.id} />
                  </td>

                  <td className="p-3.5 font-bold text-slate-700">
                    {getCourseName(s.courseId)}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      s.seatCategory === 'Supernumerary'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {s.seatCategory}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <StatusBadge status={s.status} />
                  </td>

                  <td className="p-3.5 font-mono font-semibold text-slate-800">
                    {s.academicRecord.cgpa ? `${s.academicRecord.cgpa} / 10.0` : 'N/A'}
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentDrawer(s)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-gov-navy-50 text-gov-navy-700 hover:text-gov-navy-900 font-bold rounded-lg text-xs transition-colors border border-slate-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No student records matching current query and filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredStudents.length)} of{' '}
            {filteredStudents.length} entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Details Slide-Over Drawer */}
      {selectedStudentDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 bg-gov-navy-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gov-saffron-500 rounded-lg text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    {selectedStudentDrawer.fullName}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    ID: {selectedStudentDrawer.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentDrawer(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 text-xs flex-1">
              {/* Status and Flag notice if any */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Verification Status
                  </span>
                  <div className="mt-1">
                    <StatusBadge status={selectedStudentDrawer.status} />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    APAAR Identifier
                  </span>
                  <div className="mt-1">
                    <MaskedId apaarId={selectedStudentDrawer.apaarId} studentId={selectedStudentDrawer.id} />
                  </div>
                </div>
              </div>

              {selectedStudentDrawer.flagReason && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Discrepancy Detected by Central Engine</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-800">
                    {selectedStudentDrawer.flagReason}
                  </p>
                </div>
              )}

              {/* Personal & Admission Details */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm border-b pb-1">
                  Enrolment & Identity Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 font-medium block">Date of Birth</span>
                    <span className="font-semibold text-slate-900">{formatDate(selectedStudentDrawer.dateOfBirth)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Gender</span>
                    <span className="font-semibold text-slate-900">{selectedStudentDrawer.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Institutional Email</span>
                    <span className="font-mono text-slate-900">{selectedStudentDrawer.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Registered Phone</span>
                    <span className="font-mono text-slate-900">+91 {selectedStudentDrawer.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Admission Category</span>
                    <span className="font-semibold text-slate-900">{selectedStudentDrawer.seatCategory}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Admission Date</span>
                    <span className="font-semibold text-slate-900">{formatDate(selectedStudentDrawer.admissionDate)}</span>
                  </div>
                </div>
              </div>

              {/* Reference Check against DigiLocker */}
              <div className="space-y-3 bg-sky-50/60 border border-sky-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sky-950 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>National DigiLocker / ABC Reference Profile</span>
                  </h4>
                  <SimulatedBadge size="sm" />
                </div>
                {selectedStudentDrawer.simulatedReference ? (
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-sky-900">
                    <div>
                      <span className="text-sky-600 font-medium block">Registry Name</span>
                      <span className="font-semibold">{selectedStudentDrawer.simulatedReference.fullName}</span>
                    </div>
                    <div>
                      <span className="text-sky-600 font-medium block">Registry DOB</span>
                      <span className="font-semibold">{formatDate(selectedStudentDrawer.simulatedReference.dateOfBirth)}</span>
                    </div>
                    <div>
                      <span className="text-sky-600 font-medium block">ABC Account ID</span>
                      <span className="font-mono font-semibold">{selectedStudentDrawer.simulatedReference.abcAccountId}</span>
                    </div>
                    <div>
                      <span className="text-sky-600 font-medium block">Aadhaar Linked</span>
                      <span className="font-semibold text-emerald-700">Yes (Simulated eKYC)</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No external registry sync record available.</p>
                )}
              </div>

              {/* Academic Grades */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm border-b pb-1">
                  Academic Record & Verification Authority
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Cumulative GPA</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      {selectedStudentDrawer.academicRecord.cgpa ?? 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Percentage</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      {selectedStudentDrawer.academicRecord.percentage ? `${selectedStudentDrawer.academicRecord.percentage}%` : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Current Sem</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      Sem {selectedStudentDrawer.academicRecord.semester}
                    </p>
                  </div>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Verified By: <strong className="text-slate-800">{selectedStudentDrawer.academicRecord.verifiedBy}</strong>
                </p>
              </div>

              {/* Entrance Qualifications */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm border-b pb-1">
                  Entrance & Secondary Education
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <p>
                    <strong className="text-slate-900">Entrance Test: </strong>
                    {selectedStudentDrawer.qualifications.entranceExam} (AIR: #{selectedStudentDrawer.qualifications.entranceRank})
                  </p>
                  <p>
                    <strong className="text-slate-900">Class 12th: </strong>
                    {selectedStudentDrawer.qualifications.twelfthBoard} ({selectedStudentDrawer.qualifications.twelfthYear}) — {selectedStudentDrawer.qualifications.twelfthScore}
                  </p>
                  <p>
                    <strong className="text-slate-900">Class 10th: </strong>
                    {selectedStudentDrawer.qualifications.tenthBoard} ({selectedStudentDrawer.qualifications.tenthYear}) — {selectedStudentDrawer.qualifications.tenthScore}
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudentDrawer(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
