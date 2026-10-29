import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Institution,
  Course,
  StudentRecord,
  CorrectionRequest,
  AcademicPassport,
  AuditLog,
  AuditAction,
  CorrectionStatus,
  SeatLedgerEntry,
} from '../types';
import {
  INITIAL_INSTITUTIONS,
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  INITIAL_CORRECTIONS,
  INITIAL_PASSPORTS,
  INITIAL_AUDIT_LOGS,
  DEMO_USERS,
} from '../data/seed';

interface AppState {
  currentUser: User | null;
  institutions: Institution[];
  courses: Course[];
  students: StudentRecord[];
  corrections: CorrectionRequest[];
  passports: AcademicPassport[];
  auditLogs: AuditLog[];
  revealedApaars: Record<string, boolean>;
  isDemoGuideOpen: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  setDemoGuideOpen: (open: boolean) => void;
  addAuditLog: (action: AuditAction, target: string, details: string, actorOverride?: { id: string; name: string; role: any }) => void;
  toggleRevealApaar: (studentId: string) => void;
  simulateNewAdmission: (courseId: string) => { excess: boolean; remaining: number; total: number; approved: number };
  updateStudentRecord: (student: StudentRecord) => void;
  batchUploadStudents: (records: StudentRecord[], institutionId: string, fileName?: string) => void;
  submitCorrectionRequest: (req: Omit<CorrectionRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => string;
  updateCorrectionStatus: (correctionId: string, status: CorrectionStatus, remarks?: string) => void;
  generatePassport: (data: {
    studentId: string;
    studentName: string;
    apaarId: string;
    institutionName: string;
    courseName: string;
    admissionYear: number;
    recipientName?: string;
    recipientOrganization?: string;
    sharedFields: AcademicPassport['sharedFields'];
    verifiedBadges: AcademicPassport['verifiedBadges'];
    durationHours: number;
  }) => string;
  revokePassport: (passportId: string) => void;
  recordPassportView: (token: string, viewerIp?: string) => AcademicPassport | null;
  resolveFlaggedCase: (studentId: string, notes: string) => void;
  resetDemoData: () => void;
  getSeatLedger: () => SeatLedgerEntry[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: DEMO_USERS[0], // Default logged in as Institution Admin for immediate demo experience
      institutions: INITIAL_INSTITUTIONS,
      courses: INITIAL_COURSES,
      students: INITIAL_STUDENTS,
      corrections: INITIAL_CORRECTIONS,
      passports: INITIAL_PASSPORTS,
      auditLogs: INITIAL_AUDIT_LOGS,
      revealedApaars: {},
      isDemoGuideOpen: true,

      login: (user: User) => {
        set({ currentUser: user });
        get().addAuditLog(
          'REVEAL_APAAR',
          `Session Login: ${user.name}`,
          `User successfully authenticated as [${user.role.toUpperCase()}].`
        );
      },

      logout: () => {
        const user = get().currentUser;
        if (user) {
          get().addAuditLog(
            'REVEAL_APAAR',
            `Session Logout: ${user.name}`,
            `User logged out of active session.`
          );
        }
        set({ currentUser: null });
      },

      setDemoGuideOpen: (open: boolean) => set({ isDemoGuideOpen: open }),

      addAuditLog: (action, target, details, actorOverride) => {
        const currentUser = get().currentUser;
        const actor = actorOverride || {
          id: currentUser?.id || 'sys-anon',
          name: currentUser?.name || 'Authorized Guest / Recruiter',
          role: currentUser?.role || 'public',
        };

        const newLog: AuditLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
          actorId: actor.id,
          actorName: actor.name,
          actorRole: actor.role,
          action,
          target,
          details,
          ipAddress: `164.100.${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 250 + 2)}`,
        };

        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs].slice(0, 150),
        }));
      },

      toggleRevealApaar: (studentId: string) => {
        const student = get().students.find((s) => s.id === studentId);
        const currentRevealed = !!get().revealedApaars[studentId];
        const nextRevealed = !currentRevealed;

        set((state) => ({
          revealedApaars: {
            ...state.revealedApaars,
            [studentId]: nextRevealed,
          },
        }));

        if (nextRevealed && student) {
          get().addAuditLog(
            'REVEAL_APAAR',
            `Student Identifier: ${student.fullName} (${student.id})`,
            `User revealed full 12-digit masked APAAR ID for verification.`
          );
        }
      },

      simulateNewAdmission: (courseId: string) => {
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) {
          return { excess: false, remaining: 0, total: 0, approved: 0 };
        }

        const newEnrolled = course.actualEnrolled + 1;
        const excess = newEnrolled > course.approvedIntake;
        const remaining = Math.max(0, course.approvedIntake - newEnrolled);

        // Create a simulated student record
        const simulatedStudent: StudentRecord = {
          id: `sim-stud-${Date.now()}`,
          apaarId: `77${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`,
          fullName: `Candidate ${course.courseCode}-${newEnrolled}`,
          dateOfBirth: '2004-06-15',
          gender: 'Male',
          email: `cand.${newEnrolled}@student.ac.in`,
          phone: '9876500000',
          institutionId: course.institutionId,
          courseId: course.id,
          admissionYear: 2024,
          admissionDate: new Date().toISOString().split('T')[0],
          seatCategory: 'General',
          status: excess ? 'Flagged' : 'Verified',
          flagReason: excess ? `Intake Breach: Admission #${newEnrolled} exceeds approved intake of ${course.approvedIntake}.` : undefined,
          flagType: excess ? 'ExcessSeat' : undefined,
          academicRecord: {
            cgpa: 8.5,
            percentage: 82.0,
            semester: 1,
            backlogs: 0,
            verifiedBy: 'Simulated Online Admission Seat',
          },
          qualifications: {
            tenthBoard: 'CBSE',
            tenthYear: 2020,
            tenthScore: '92.0%',
            twelfthBoard: 'CBSE',
            twelfthYear: 2022,
            twelfthScore: '90.5%',
            entranceExam: 'JEE Main',
            entranceRank: 1200 + newEnrolled * 5,
          },
        };

        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  actualEnrolled: newEnrolled,
                  enrolledByCategory: {
                    ...c.enrolledByCategory,
                    general: c.enrolledByCategory.general + 1,
                  },
                }
              : c
          ),
          institutions: state.institutions.map((inst) =>
            inst.id === course.institutionId
              ? {
                  ...inst,
                  totalEnrolled: inst.totalEnrolled + 1,
                  status: excess ? 'ExcessEnrolment' : inst.status,
                }
              : inst
          ),
          students: [simulatedStudent, ...state.students],
        }));

        get().addAuditLog(
          'SIMULATE_ADMISSION',
          `Course: ${course.courseCode} (${course.courseName})`,
          `Simulated real-time admission #${newEnrolled} into ${course.courseCode}. Intake: ${course.approvedIntake}. Status: ${
            excess ? 'EXCESS BREACH FLAGGED' : 'Accepted'
          }`
        );

        return {
          excess,
          remaining,
          total: newEnrolled,
          approved: course.approvedIntake,
        };
      },

      updateStudentRecord: (updatedStudent: StudentRecord) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === updatedStudent.id ? updatedStudent : s
          ),
        }));

        get().addAuditLog(
          'CORRECTION_APPROVED',
          `StudentRecord: ${updatedStudent.fullName} (${updatedStudent.id})`,
          `Record updated. Status is now ${updatedStudent.status}. APAAR: ${updatedStudent.apaarId || 'None'}`
        );
      },

      batchUploadStudents: (records: StudentRecord[], institutionId: string, fileName = 'batch_upload.csv') => {
        const cleanCount = records.filter((r) => r.status === 'Verified').length;
        const flaggedCount = records.length - cleanCount;

        set((state) => {
          // Append new records
          const newStudentList = [...records, ...state.students];

          // Recalculate courses enrolment
          const courseEnrolments: Record<string, number> = {};
          newStudentList.forEach((s) => {
            courseEnrolments[s.courseId] = (courseEnrolments[s.courseId] || 0) + 1;
          });

          const updatedCourses = state.courses.map((course) => {
            if (course.institutionId === institutionId && courseEnrolments[course.id] !== undefined) {
              return {
                ...course,
                actualEnrolled: courseEnrolments[course.id],
              };
            }
            return course;
          });

          // Update institution totals
          const updatedInstitutions = state.institutions.map((inst) => {
            if (inst.id === institutionId) {
              const instCourses = updatedCourses.filter((c) => c.institutionId === inst.id);
              const totalEnrolled = instCourses.reduce((sum, c) => sum + c.actualEnrolled, 0);
              const hasExcess = instCourses.some((c) => c.actualEnrolled > c.approvedIntake);
              return {
                ...inst,
                totalEnrolled,
                status: hasExcess ? ('ExcessEnrolment' as const) : inst.status,
              };
            }
            return inst;
          });

          return {
            students: newStudentList,
            courses: updatedCourses,
            institutions: updatedInstitutions,
          };
        });

        get().addAuditLog(
          'UPLOAD_BATCH',
          `File: ${fileName}`,
          `Imported ${records.length} records (${cleanCount} clean, ${flaggedCount} flagged for review).`
        );
      },

      submitCorrectionRequest: (reqData) => {
        const newId = `corr-${Date.now()}`;
        const newReq: CorrectionRequest = {
          ...reqData,
          id: newId,
          status: 'Requested',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          corrections: [newReq, ...state.corrections],
        }));

        get().addAuditLog(
          'CORRECTION_REQUESTED',
          `Correction for ${reqData.studentName} (${reqData.fieldToCorrect})`,
          `Student requested correction: ${reqData.currentValue} -> ${reqData.requestedValue}. Reason: ${reqData.reason}`
        );

        return newId;
      },

      updateCorrectionStatus: (correctionId: string, status: CorrectionStatus, remarks?: string) => {
        const correction = get().corrections.find((c) => c.id === correctionId);
        if (!correction) return;

        set((state) => ({
          corrections: state.corrections.map((c) =>
            c.id === correctionId
              ? {
                  ...c,
                  status,
                  institutionRemarks: remarks || c.institutionRemarks,
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
          // If approved/updated, automatically update student record!
          students:
            status === 'Updated'
              ? state.students.map((student) => {
                  if (student.id === correction.studentId) {
                    const updated = { ...student };
                    if (correction.fieldToCorrect === 'dateOfBirth') {
                      updated.dateOfBirth = correction.requestedValue;
                      // Clear DOB flag!
                      updated.status = 'Verified';
                      updated.flagReason = undefined;
                      updated.flagType = undefined;
                      updated.reconciliationStatus = 'Matched';
                      updated.reconciliationDiscrepancies = [];
                    } else if (correction.fieldToCorrect === 'fullName') {
                      updated.fullName = correction.requestedValue;
                      updated.status = 'Verified';
                      updated.flagReason = undefined;
                    } else if (correction.fieldToCorrect === 'email') {
                      updated.email = correction.requestedValue;
                    } else if (correction.fieldToCorrect === 'phone') {
                      updated.phone = correction.requestedValue;
                    }
                    return updated;
                  }
                  return student;
                })
              : state.students,
        }));

        const action: AuditAction = status === 'Updated' ? 'CORRECTION_APPROVED' : 'CORRECTION_REJECTED';
        get().addAuditLog(
          action,
          `Correction #${correctionId} (${correction.studentName})`,
          `Institution ${status === 'Updated' ? 'approved and synchronized' : 'rejected'} correction. Remarks: ${remarks || 'None'}`
        );
      },

      generatePassport: (data) => {
        const token = `pass-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
        const expiresAt = new Date(Date.now() + data.durationHours * 60 * 60 * 1000).toISOString();

        const newPassport: AcademicPassport = {
          id: `pass-${Date.now()}`,
          token,
          studentId: data.studentId,
          studentName: data.studentName,
          apaarId: data.apaarId,
          institutionName: data.institutionName,
          courseName: data.courseName,
          admissionYear: data.admissionYear,
          recipientName: data.recipientName,
          recipientOrganization: data.recipientOrganization,
          sharedFields: data.sharedFields,
          verifiedBadges: data.verifiedBadges,
          expiresAt,
          createdAt: new Date().toISOString(),
          isRevoked: false,
          viewsCount: 0,
        };

        set((state) => ({
          passports: [newPassport, ...state.passports],
        }));

        get().addAuditLog(
          'PASSPORT_GENERATED',
          `Verified Passport for ${data.studentName}`,
          `Generated secure token: ${token}. Expires in ${data.durationHours} hours. Recipient: ${data.recipientOrganization || 'General Recruiter'}`
        );

        return token;
      },

      revokePassport: (passportId: string) => {
        const passport = get().passports.find((p) => p.id === passportId);
        if (!passport) return;

        set((state) => ({
          passports: state.passports.map((p) =>
            p.id === passportId ? { ...p, isRevoked: true } : p
          ),
        }));

        get().addAuditLog(
          'PASSPORT_REVOKED',
          `Passport Token: ${passport.token}`,
          `Student revoked active sharing link for ${passport.recipientOrganization || 'Recruiter'}.`
        );
      },

      recordPassportView: (token: string, viewerIp?: string) => {
        const passport = get().passports.find((p) => p.token === token);
        if (!passport) return null;

        const isExpired = new Date(passport.expiresAt).getTime() < Date.now();
        if (passport.isRevoked || isExpired) {
          return passport;
        }

        const updatedViews = passport.viewsCount + 1;
        set((state) => ({
          passports: state.passports.map((p) =>
            p.token === token
              ? { ...p, viewsCount: updatedViews, lastViewedAt: new Date().toISOString() }
              : p
          ),
        }));

        get().addAuditLog(
          'PASSPORT_VERIFIED',
          `Verified Passport: ${passport.studentName} (Token: ${token})`,
          `Recruiter accessed and verified academic passport. Total views: ${updatedViews}`,
          {
            id: 'usr-recruiter-anon',
            name: passport.recipientOrganization ? `Recruiter (${passport.recipientOrganization})` : 'Authorized Verifier',
            role: 'recruiter',
          }
        );

        return { ...passport, viewsCount: updatedViews };
      },

      resolveFlaggedCase: (studentId: string, notes: string) => {
        const student = get().students.find((s) => s.id === studentId);
        if (!student) return;

        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  status: 'Verified',
                  flagReason: undefined,
                  flagType: undefined,
                  reconciliationStatus: 'Matched',
                  reconciliationDiscrepancies: [],
                }
              : s
          ),
        }));

        get().addAuditLog(
          'FLAG_RESOLVED',
          `Student ${student.fullName} (${student.id})`,
          `AICTE Official resolved anomaly. Resolution notes: ${notes}`
        );
      },

      resetDemoData: () => {
        set({
          currentUser: DEMO_USERS[0],
          institutions: INITIAL_INSTITUTIONS,
          courses: INITIAL_COURSES,
          students: INITIAL_STUDENTS,
          corrections: INITIAL_CORRECTIONS,
          passports: INITIAL_PASSPORTS,
          auditLogs: INITIAL_AUDIT_LOGS,
          revealedApaars: {},
        });
      },

      getSeatLedger: () => {
        const { courses, institutions } = get();
        return courses.map((course) => {
          const inst = institutions.find((i) => i.id === course.institutionId);
          const remainingSeats = Math.max(0, course.approvedIntake - course.actualEnrolled);
          const excessAdmissions = Math.max(0, course.actualEnrolled - course.approvedIntake);
          const isExcessWarning = excessAdmissions > 0;

          let status: SeatLedgerEntry['status'] = 'Normal';
          if (isExcessWarning) {
            status = 'ExcessAdmissions';
          } else if (remainingSeats <= 2) {
            status = 'NearCapacity';
          }

          return {
            courseId: course.id,
            courseCode: course.courseCode,
            courseName: course.courseName,
            institutionId: course.institutionId,
            institutionName: inst?.name || 'Unknown Institution',
            approvedIntake: course.approvedIntake,
            validAdmissions: course.actualEnrolled,
            remainingSeats,
            excessAdmissions,
            categoryBreakdown: course.categoryBreakdown,
            enrolledByCategory: course.enrolledByCategory,
            isExcessWarning,
            status,
          };
        });
      },
    }),
    {
      name: 'apaar_aicte_platform_state_v1',
    }
  )
);
