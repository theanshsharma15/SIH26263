/**
 * Simulated Government API Layer
 * Mimics REST endpoints with asynchronous responses and network latency.
 */

import { useAppStore } from '../store/useAppStore';
import { StudentRecord, CorrectionRequest, AcademicPassport, SeatLedgerEntry, Institution, Course } from '../types';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Authentication
  async getCurrentUser() {
    await delay(100);
    return useAppStore.getState().currentUser;
  },

  // Institutions
  async getInstitutions(): Promise<Institution[]> {
    await delay(150);
    return useAppStore.getState().institutions;
  },

  async getCourses(institutionId?: string): Promise<Course[]> {
    await delay(150);
    const courses = useAppStore.getState().courses;
    if (institutionId) {
      return courses.filter((c) => c.institutionId === institutionId);
    }
    return courses;
  },

  // Student Records
  async getStudents(filters?: {
    institutionId?: string;
    courseId?: string;
    status?: string;
    search?: string;
  }): Promise<StudentRecord[]> {
    await delay(200);
    let list = useAppStore.getState().students;

    if (filters?.institutionId) {
      list = list.filter((s) => s.institutionId === filters.institutionId);
    }
    if (filters?.courseId) {
      list = list.filter((s) => s.courseId === filters.courseId);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((s) => s.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.apaarId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async getStudentById(id: string): Promise<StudentRecord | undefined> {
    await delay(150);
    return useAppStore.getState().students.find((s) => s.id === id);
  },

  async getStudentByApaar(apaarId: string): Promise<StudentRecord | undefined> {
    await delay(150);
    return useAppStore.getState().students.find((s) => s.apaarId === apaarId);
  },

  // Seat Compliance Ledger
  async getSeatLedger(): Promise<SeatLedgerEntry[]> {
    await delay(200);
    return useAppStore.getState().getSeatLedger();
  },

  // Corrections
  async getCorrections(institutionId?: string): Promise<CorrectionRequest[]> {
    await delay(150);
    const corrections = useAppStore.getState().corrections;
    if (institutionId) {
      return corrections.filter((c) => c.institutionId === institutionId);
    }
    return corrections;
  },

  // Academic Passport Verification
  async getPassportByToken(token: string): Promise<AcademicPassport | null> {
    await delay(250);
    return useAppStore.getState().recordPassportView(token);
  },
};
