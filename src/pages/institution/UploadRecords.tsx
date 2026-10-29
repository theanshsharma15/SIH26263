import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileCheck,
  RefreshCw,
  ArrowRight,
  Download,
  Info,
  Edit2,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StudentRecord, ValidationIssue, VerificationStatus } from '../../types';
import { isValidApaarFormat, formatApaarId } from '../../utils/apaar';
import { SimulatedBadge } from '../../components/common/SimulatedBadge';

interface ParsedRow {
  rowNumber: number;
  apaarId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  courseCode: string;
  admissionYear: string | number;
  seatCategory: string;
  isValid: boolean;
  issues: string[];
}

export const UploadRecords: React.FC = () => {
  const { currentUser, courses, batchUploadStudents, institutions } = useAppStore();
  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rawRows, setRawRows] = useState<ParsedRow[]>([]);
  const [editingRowNumber, setEditingRowNumber] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ParsedRow>>({});
  const [committedSuccess, setCommittedSuccess] = useState<boolean>(false);
  const [committedCount, setCommittedCount] = useState<number>(0);

  // Validate rows against business rules & APAAR format
  const runValidation = (rows: Array<Record<string, any>>): ParsedRow[] => {
    const validCourseCodes = courses
      .filter((c) => c.institutionId === currentInst.id)
      .map((c) => c.courseCode.toUpperCase());

    const seenApaarIds: Record<string, number> = {};

    return rows.map((r, index) => {
      const rowNumber = index + 2; // header is row 1
      const issues: string[] = [];

      const rawApaar = (r.apaarId || r.APAAR_ID || r.apaar_id || '').toString().trim();
      const fullName = (r.fullName || r.Name || r.name || '').toString().trim();
      const dob = (r.dateOfBirth || r.DOB || r.dob || '').toString().trim();
      const gender = (r.gender || r.Gender || 'Male').toString().trim();
      const email = (r.email || r.Email || '').toString().trim();
      const phone = (r.phone || r.Phone || '').toString().trim();
      const courseCode = (r.courseCode || r.Course || r.course || 'BTECH-CSE').toString().trim().toUpperCase();
      const admissionYear = Number(r.admissionYear || r.AdmissionYear || 2024);
      const seatCategory = (r.seatCategory || r.Category || 'General').toString().trim();

      // Rule 1: Full name check
      if (!fullName) {
        issues.push('Missing Student Full Name');
      }

      // Rule 2: APAAR format check
      if (!rawApaar) {
        issues.push('Missing Mandatory APAAR ID');
      } else {
        const check = isValidApaarFormat(rawApaar);
        if (!check.isValid) {
          issues.push(check.error || 'Invalid APAAR format');
        } else {
          // Rule 3: Duplicate APAAR check within same batch
          if (seenApaarIds[rawApaar] !== undefined) {
            issues.push(`Duplicate APAAR ID: clashes with Row #${seenApaarIds[rawApaar]}`);
          } else {
            seenApaarIds[rawApaar] = rowNumber;
          }
        }
      }

      // Rule 4: Valid email
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        issues.push(`Invalid email format: "${email}"`);
      }

      // Rule 5: Course code matching
      if (validCourseCodes.length > 0 && !validCourseCodes.includes(courseCode)) {
        issues.push(`Course "${courseCode}" not found in institutional catalog (allowed: ${validCourseCodes.join(', ')})`);
      }

      return {
        rowNumber,
        apaarId: rawApaar ? formatApaarId(rawApaar) : '',
        fullName,
        dateOfBirth: dob || '2004-01-01',
        gender,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@student.ac.in`,
        phone: phone || '9876543210',
        courseCode,
        admissionYear,
        seatCategory,
        isValid: issues.length === 0,
        issues,
      };
    });
  };

  // Handle uploaded File
  const processFile = (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);
    setCommittedSuccess(false);

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet);
          const validated = runValidation(json);
          setRawRows(validated);
        } catch (err) {
          alert('Failed to parse Excel file. Please ensure valid format.');
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validated = runValidation(results.data as any[]);
          setRawRows(validated);
          setIsProcessing(false);
        },
        error: () => {
          alert('Error parsing CSV file');
          setIsProcessing(false);
        },
      });
    }
  };

  // Quick button to load pre-seeded demo file
  const handleLoadDemoSample = async () => {
    setIsProcessing(true);
    setFileName('sample_students.csv (Preloaded Demo)');
    setCommittedSuccess(false);
    try {
      const res = await fetch('/sample_students.csv');
      const text = await res.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validated = runValidation(results.data as any[]);
          setRawRows(validated);
          setIsProcessing(false);
        },
      });
    } catch {
      setIsProcessing(false);
    }
  };

  // Start inline editing of an erroneous row
  const startEdit = (row: ParsedRow) => {
    setEditingRowNumber(row.rowNumber);
    setEditFormData({ ...row });
  };

  // Save inline edit and immediately re-validate that row!
  const saveEdit = (rowNumber: number) => {
    const updated = rawRows.map((r) => {
      if (r.rowNumber === rowNumber) {
        const merged = { ...r, ...editFormData };
        // re-run validation on this single row
        const singleValidated = runValidation([merged])[0];
        singleValidated.rowNumber = rowNumber;
        return singleValidated;
      }
      return r;
    });

    setRawRows(updated);
    setEditingRowNumber(null);
  };

  // Re-run validation across all rows
  const handleRevalidateAll = () => {
    const revalidated = runValidation(rawRows);
    setRawRows(revalidated);
  };

  // Commit clean records to store
  const handleCommitCleanRecords = () => {
    const cleanRows = rawRows.filter((r) => r.isValid);
    if (cleanRows.length === 0) {
      alert('No clean records to commit. Please fix errors first.');
      return;
    }

    const matchedCourses = courses.filter((c) => c.institutionId === currentInst.id);

    const convertedStudents: StudentRecord[] = cleanRows.map((row, idx) => {
      const targetCourse = matchedCourses.find((c) => c.courseCode === row.courseCode) || matchedCourses[0];

      return {
        id: `batch-${Date.now()}-${idx}`,
        apaarId: row.apaarId,
        fullName: row.fullName,
        dateOfBirth: row.dateOfBirth,
        gender: (row.gender as any) || 'Male',
        email: row.email,
        phone: row.phone,
        institutionId: currentInst.id,
        courseId: targetCourse.id,
        admissionYear: Number(row.admissionYear) || 2024,
        admissionDate: new Date().toISOString().split('T')[0],
        seatCategory: (row.seatCategory as any) || 'General',
        status: 'Verified',
        reconciliationStatus: 'Matched',
        academicRecord: {
          cgpa: 8.5,
          percentage: 81.0,
          semester: 1,
          backlogs: 0,
          verifiedBy: 'AICTE Institutional Admission Import',
          verifiedAt: new Date().toISOString(),
        },
        qualifications: {
          tenthBoard: 'CBSE',
          tenthYear: 2020,
          tenthScore: '91.0%',
          twelfthBoard: 'CBSE',
          twelfthYear: 2022,
          twelfthScore: '89.5%',
          entranceExam: 'JEE / State CET',
          entranceRank: 1400 + idx * 10,
        },
      };
    });

    batchUploadStudents(convertedStudents, currentInst.id, fileName);
    setCommittedCount(convertedStudents.length);
    setCommittedSuccess(true);
    // Remove committed rows from list
    setRawRows(rawRows.filter((r) => !r.isValid));
  };

  const validCount = rawRows.filter((r) => r.isValid).length;
  const invalidCount = rawRows.filter((r) => !r.isValid).length;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gov-navy-600 uppercase tracking-wider">
              Enrolment Ingestion Engine
            </span>
            <SimulatedBadge size="sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Batch Admission Records Upload & Validation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload CSV or Excel spreadsheets containing candidate enrollment records for {currentInst.shortName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sample_students.csv"
            download
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Template</span>
          </a>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-gov-navy-500 rounded-2xl p-8 text-center transition-all bg-slate-50/50 hover:bg-gov-navy-50/20"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) processFile(e.target.files[0]);
            }}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />

          <div className="w-16 h-16 bg-gov-navy-100 text-gov-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8 text-gov-navy-600" />
          </div>

          <h3 className="font-extrabold text-base text-slate-900 mb-1">
            Drag & Drop Student Admission File Here
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Supports CSV, XLSX, XLS with standard APAAR headers (max 5,000 records per batch)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-gov-navy-600 hover:bg-gov-navy-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Browse Local Computer
            </button>

            <button
              type="button"
              onClick={handleLoadDemoSample}
              className="px-5 py-2.5 bg-gov-saffron-500 hover:bg-gov-saffron-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Load Pre-Packaged Demo CSV</span>
            </button>
          </div>
        </div>

        {/* Expected Schema Badges */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-700">Expected Columns:</span>
          {['apaarId', 'fullName', 'dateOfBirth', 'gender', 'email', 'phone', 'courseCode', 'admissionYear', 'seatCategory'].map((col) => (
            <span key={col} className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700 border border-slate-200">
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* Committed Success Notification */}
      {committedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-900 flex items-start justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">
                Successfully Committed {committedCount} Clean Admission Records!
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Central Repository and Seat Ledgers have been updated immediately. Audit log entry recorded.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Parsing & Validation Results */}
      {rawRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Summary bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>Validation Run Summary</span>
                <span className="text-xs font-mono font-medium text-slate-500">({fileName})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review flagged validation errors before final submission to AICTE National Registry.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRevalidateAll}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Validate</span>
              </button>

              <button
                type="button"
                disabled={validCount === 0}
                onClick={handleCommitCleanRecords}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                  validCount > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Commit Clean Records ({validCount})</span>
              </button>
            </div>
          </div>

          {/* Validation Counters */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Rows</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{rawRows.length}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <p className="text-xs text-emerald-700 font-semibold uppercase">Clean & Valid</p>
              <p className="text-xl font-black text-emerald-900 mt-0.5">{validCount}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-center">
              <p className="text-xs text-rose-700 font-semibold uppercase">Flagged Errors</p>
              <p className="text-xl font-black text-rose-900 mt-0.5">{invalidCount}</p>
            </div>
          </div>

          {/* Records Table with Inline Editing */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                <tr>
                  <th className="p-3 w-14">Row</th>
                  <th className="p-3">Candidate Name</th>
                  <th className="p-3">APAAR ID (12 Digits)</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Validation Status & Issues</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rawRows.map((row) => {
                  const isEditing = editingRowNumber === row.rowNumber;

                  return (
                    <tr
                      key={row.rowNumber}
                      className={
                        !row.isValid
                          ? 'bg-rose-50/40 hover:bg-rose-50/70'
                          : 'hover:bg-slate-50'
                      }
                    >
                      <td className="p-3 font-mono font-bold text-slate-600">
                        #{row.rowNumber}
                      </td>

                      <td className="p-3 font-medium text-slate-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.fullName ?? row.fullName}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, fullName: e.target.value })
                            }
                            className="px-2 py-1 border rounded text-xs w-full bg-white"
                          />
                        ) : (
                          row.fullName
                        )}
                      </td>

                      <td className="p-3 font-mono">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={editFormData.apaarId ?? row.apaarId}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, apaarId: e.target.value })
                              }
                              placeholder="e.g. 9845-2134-8899"
                              className="px-2 py-1 border rounded text-xs w-full bg-white font-mono"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setEditFormData({
                                  ...editFormData,
                                  apaarId: `9845-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`,
                                })
                              }
                              className="text-[10px] text-gov-navy-600 font-bold underline"
                            >
                              Generate Valid APAAR
                            </button>
                          </div>
                        ) : row.apaarId ? (
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {row.apaarId}
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                            [Missing APAAR]
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-bold text-slate-700">
                        {row.courseCode}
                      </td>

                      <td className="p-3">
                        {row.isValid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valid</span>
                          </span>
                        ) : (
                          <div className="space-y-1">
                            {row.issues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 text-rose-700 font-medium"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>{issue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => saveEdit(row.rowNumber)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                              title="Save & Validate Row"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingRowNumber(null)}
                              className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(row)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-gov-navy-600" />
                            <span>Fix</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
