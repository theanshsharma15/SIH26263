export type UserRole = 'institution' | 'aicte' | 'student' | 'recruiter' | 'public';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string;
  apaarId?: string;
  avatar?: string;
  department?: string;
  designation?: string;
  organization?: string;
}

export interface Institution {
  id: string;
  aicteId: string;
  name: string;
  shortName: string;
  state: string;
  city: string;
  type: 'Central' | 'State' | 'Autonomous' | 'Private';
  contactEmail: string;
  contactPhone: string;
  totalIntake: number;
  totalEnrolled: number;
  status: 'Compliant' | 'Warning' | 'ExcessEnrolment';
}

export interface CategoryBreakdown {
  general: number;
  ews: number;
  sc: number;
  st: number;
  obc: number;
  supernumerary: number; // TFW, PMSSS, Sports/Defence
}

export interface Course {
  id: string;
  institutionId: string;
  courseCode: string;
  courseName: string;
  degreeLevel: 'UG' | 'PG' | 'Diploma';
  approvedIntake: number;
  categoryBreakdown: CategoryBreakdown;
  actualEnrolled: number;
  enrolledByCategory: CategoryBreakdown;
}

export type VerificationStatus = 'Verified' | 'Pending' | 'NeedsCorrection' | 'Flagged';
export type FlagType = 'MissingId' | 'DuplicateId' | 'DataMismatch' | 'ExcessSeat';

export interface StudentRecord {
  id: string;
  apaarId: string; // 12-digit format e.g. "9845-2134-7712" or blank if missing
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  institutionId: string;
  courseId: string;
  admissionYear: number;
  admissionDate: string;
  seatCategory: 'General' | 'EWS' | 'SC' | 'ST' | 'OBC' | 'Supernumerary';
  status: VerificationStatus;
  flagReason?: string;
  flagType?: FlagType;
  reconciliationStatus?: 'Matched' | 'Discrepancy' | 'Unlinked';
  reconciliationDiscrepancies?: string[];
  academicRecord: {
    cgpa?: number;
    percentage?: number;
    semester: number;
    backlogs: number;
    verifiedBy: string;
    verifiedAt?: string;
  };
  qualifications: {
    tenthBoard: string;
    tenthYear: number;
    tenthScore: string;
    twelfthBoard: string;
    twelfthYear: number;
    twelfthScore: string;
    entranceExam: string;
    entranceRank: number;
  };
  simulatedReference?: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    fatherName: string;
    aadhaarLinked: boolean;
    abcAccountId: string;
    source: string;
  };
}

export interface SeatLedgerEntry {
  courseId: string;
  courseCode: string;
  courseName: string;
  institutionId: string;
  institutionName: string;
  approvedIntake: number;
  validAdmissions: number;
  remainingSeats: number;
  excessAdmissions: number;
  categoryBreakdown: CategoryBreakdown;
  enrolledByCategory: CategoryBreakdown;
  isExcessWarning: boolean;
  status: 'Normal' | 'NearCapacity' | 'ExcessAdmissions';
}

export type CorrectionStatus = 'Requested' | 'UnderReview' | 'Updated' | 'Rejected';

export interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  apaarId: string;
  institutionId: string;
  courseName: string;
  fieldToCorrect: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  documentName?: string;
  status: CorrectionStatus;
  institutionRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldVerificationBadge {
  status: 'Verified' | 'Pending' | 'Unverified';
  source: string;
  verifiedAt?: string;
}

export interface AcademicPassport {
  id: string;
  token: string;
  studentId: string;
  studentName: string;
  apaarId: string;
  institutionName: string;
  courseName: string;
  admissionYear: number;
  recipientName?: string;
  recipientOrganization?: string;
  sharedFields: {
    institutionAndCourse: boolean;
    admissionDetails: boolean;
    academicQualifications: boolean;
    verifiedGrades: boolean;
    attendanceStatus: boolean;
  };
  verifiedBadges: Record<string, FieldVerificationBadge>;
  expiresAt: string;
  createdAt: string;
  isRevoked: boolean;
  viewsCount: number;
  lastViewedAt?: string;
}

export type AuditAction =
  | 'UPLOAD_BATCH'
  | 'REVEAL_APAAR'
  | 'CORRECTION_REQUESTED'
  | 'CORRECTION_APPROVED'
  | 'CORRECTION_REJECTED'
  | 'PASSPORT_GENERATED'
  | 'PASSPORT_REVOKED'
  | 'PASSPORT_VERIFIED'
  | 'SIMULATE_ADMISSION'
  | 'FLAG_RESOLVED'
  | 'REPORT_EXPORTED';

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditAction;
  target: string;
  details: string;
  ipAddress: string;
}

export interface ValidationIssue {
  rowNumber: number;
  field: string;
  issue: string;
  severity: 'Error' | 'Warning';
  suggestedFix?: string;
  originalRow: Record<string, any>;
}
