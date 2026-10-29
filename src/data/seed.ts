import { Institution, Course, StudentRecord, CorrectionRequest, AcademicPassport, AuditLog, User } from '../types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    aicteId: '1-332014501',
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Central',
    contactEmail: 'admissions@admin.iitd.ac.in',
    contactPhone: '+91-11-2659-7135',
    totalIntake: 350,
    totalEnrolled: 339,
    status: 'Compliant',
  },
  {
    id: 'inst-2',
    aicteId: '1-109923412',
    name: 'COEP Technological University Pune',
    shortName: 'COEP Tech',
    state: 'Maharashtra',
    city: 'Pune',
    type: 'Autonomous',
    contactEmail: 'registrar@coeptech.ac.in',
    contactPhone: '+91-20-2550-7000',
    totalIntake: 300,
    totalEnrolled: 301,
    status: 'ExcessEnrolment',
  },
  {
    id: 'inst-3',
    aicteId: '1-224891104',
    name: 'National Institute of Technology Karnataka',
    shortName: 'NITK Surathkal',
    state: 'Karnataka',
    city: 'Mangaluru',
    type: 'Central',
    contactEmail: 'dean.acad@nitk.edu.in',
    contactPhone: '+91-824-2474-000',
    totalIntake: 280,
    totalEnrolled: 275,
    status: 'Compliant',
  },
  {
    id: 'inst-4',
    aicteId: '1-456123987',
    name: 'RV College of Engineering',
    shortName: 'RVCE Bangalore',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Autonomous',
    contactEmail: 'principal@rvce.edu.in',
    contactPhone: '+91-80-6818-8100',
    totalIntake: 240,
    totalEnrolled: 236,
    status: 'Compliant',
  },
  {
    id: 'inst-5',
    aicteId: '1-897654321',
    name: 'Veermata Jijabai Technological Institute',
    shortName: 'VJTI Mumbai',
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'State',
    contactEmail: 'director@vjti.ac.in',
    contactPhone: '+91-22-2419-8101',
    totalIntake: 260,
    totalEnrolled: 257,
    status: 'Compliant',
  },
  {
    id: 'inst-6',
    aicteId: '1-778899001',
    name: 'College of Engineering Guindy, Anna University',
    shortName: 'CEG Anna Univ',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'State',
    contactEmail: 'dean@ceg.annauniv.edu',
    contactPhone: '+91-44-2235-8491',
    totalIntake: 320,
    totalEnrolled: 318,
    status: 'Warning',
  },
];

export const INITIAL_COURSES: Course[] = [
  // IIT Delhi Courses
  {
    id: 'course-iitd-cse',
    institutionId: 'inst-1',
    courseCode: 'BTECH-CSE',
    courseName: 'B.Tech in Computer Science & Engineering',
    degreeLevel: 'UG',
    approvedIntake: 120,
    categoryBreakdown: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
    actualEnrolled: 118, // 2 seats remaining - ideal for live demo!
    enrolledByCategory: { general: 59, ews: 12, sc: 18, st: 8, obc: 32, supernumerary: 5 },
  },
  {
    id: 'course-iitd-ee',
    institutionId: 'inst-1',
    courseCode: 'BTECH-EE',
    courseName: 'B.Tech in Electrical Engineering',
    degreeLevel: 'UG',
    approvedIntake: 90,
    categoryBreakdown: { general: 45, ews: 9, sc: 14, st: 7, obc: 24, supernumerary: 4 },
    actualEnrolled: 88,
    enrolledByCategory: { general: 44, ews: 9, sc: 14, st: 7, obc: 24, supernumerary: 3 },
  },
  {
    id: 'course-iitd-mech',
    institutionId: 'inst-1',
    courseCode: 'BTECH-MECH',
    courseName: 'B.Tech in Mechanical Engineering',
    degreeLevel: 'UG',
    approvedIntake: 100,
    categoryBreakdown: { general: 50, ews: 10, sc: 15, st: 8, obc: 27, supernumerary: 5 },
    actualEnrolled: 95,
    enrolledByCategory: { general: 48, ews: 10, sc: 14, st: 8, obc: 26, supernumerary: 4 },
  },
  {
    id: 'course-iitd-ai',
    institutionId: 'inst-1',
    courseCode: 'MTECH-AI',
    courseName: 'M.Tech in Artificial Intelligence',
    degreeLevel: 'PG',
    approvedIntake: 40,
    categoryBreakdown: { general: 20, ews: 4, sc: 6, st: 3, obc: 11, supernumerary: 2 },
    actualEnrolled: 38,
    enrolledByCategory: { general: 19, ews: 4, sc: 6, st: 3, obc: 11, supernumerary: 2 },
  },

  // COEP Pune Courses (includes excess admission case)
  {
    id: 'course-coep-cse',
    institutionId: 'inst-2',
    courseCode: 'BTECH-CSE',
    courseName: 'B.Tech in Computer Engineering',
    degreeLevel: 'UG',
    approvedIntake: 120,
    categoryBreakdown: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
    actualEnrolled: 120,
    enrolledByCategory: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
  },
  {
    id: 'course-coep-ee',
    institutionId: 'inst-2',
    courseCode: 'BTECH-EE',
    courseName: 'B.Tech in Electrical Engineering',
    degreeLevel: 'UG',
    approvedIntake: 60,
    categoryBreakdown: { general: 30, ews: 6, sc: 9, st: 5, obc: 16, supernumerary: 3 },
    actualEnrolled: 61, // Excess admission by 1!
    enrolledByCategory: { general: 31, ews: 6, sc: 9, st: 5, obc: 16, supernumerary: 3 },
  },
  {
    id: 'course-coep-mech',
    institutionId: 'inst-2',
    courseCode: 'BTECH-MECH',
    courseName: 'B.Tech in Mechanical Engineering',
    degreeLevel: 'UG',
    approvedIntake: 120,
    categoryBreakdown: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
    actualEnrolled: 120,
    enrolledByCategory: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
  },

  // NITK Surathkal Courses
  {
    id: 'course-nitk-cse',
    institutionId: 'inst-3',
    courseCode: 'BTECH-CSE',
    courseName: 'B.Tech in Computer Science & Engineering',
    degreeLevel: 'UG',
    approvedIntake: 120,
    categoryBreakdown: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
    actualEnrolled: 119,
    enrolledByCategory: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 5 },
  },
  {
    id: 'course-nitk-ece',
    institutionId: 'inst-3',
    courseCode: 'BTECH-ECE',
    courseName: 'B.Tech in Electronics & Communication',
    degreeLevel: 'UG',
    approvedIntake: 90,
    categoryBreakdown: { general: 45, ews: 9, sc: 14, st: 7, obc: 24, supernumerary: 4 },
    actualEnrolled: 89,
    enrolledByCategory: { general: 45, ews: 9, sc: 14, st: 7, obc: 24, supernumerary: 4 },
  },
  {
    id: 'course-nitk-it',
    institutionId: 'inst-3',
    courseCode: 'BTECH-IT',
    courseName: 'B.Tech in Information Technology',
    degreeLevel: 'UG',
    approvedIntake: 70,
    categoryBreakdown: { general: 35, ews: 7, sc: 11, st: 5, obc: 19, supernumerary: 3 },
    actualEnrolled: 67,
    enrolledByCategory: { general: 34, ews: 7, sc: 10, st: 5, obc: 18, supernumerary: 3 },
  },

  // RVCE Courses
  {
    id: 'course-rvce-cse',
    institutionId: 'inst-4',
    courseCode: 'BTECH-CSE',
    courseName: 'B.E. in Computer Science & Engineering',
    degreeLevel: 'UG',
    approvedIntake: 120,
    categoryBreakdown: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
    actualEnrolled: 118,
    enrolledByCategory: { general: 59, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 5 },
  },
  {
    id: 'course-rvce-ise',
    institutionId: 'inst-4',
    courseCode: 'BTECH-ISE',
    courseName: 'B.E. in Information Science & Engineering',
    degreeLevel: 'UG',
    approvedIntake: 120,
    categoryBreakdown: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
    actualEnrolled: 118,
    enrolledByCategory: { general: 60, ews: 11, sc: 18, st: 9, obc: 32, supernumerary: 5 },
  },

  // VJTI Courses
  {
    id: 'course-vjti-cse',
    institutionId: 'inst-5',
    courseCode: 'BTECH-CSE',
    courseName: 'B.Tech in Computer Engineering',
    degreeLevel: 'UG',
    approvedIntake: 120,
    categoryBreakdown: { general: 60, ews: 12, sc: 18, st: 9, obc: 32, supernumerary: 6 },
    actualEnrolled: 119,
    enrolledByCategory: { general: 60, ews: 12, sc: 18, st: 9, obc: 31, supernumerary: 6 },
  },
  {
    id: 'course-vjti-ee',
    institutionId: 'inst-5',
    courseCode: 'BTECH-EE',
    courseName: 'B.Tech in Electrical Engineering',
    degreeLevel: 'UG',
    approvedIntake: 80,
    categoryBreakdown: { general: 40, ews: 8, sc: 12, st: 6, obc: 22, supernumerary: 4 },
    actualEnrolled: 79,
    enrolledByCategory: { general: 40, ews: 8, sc: 12, st: 6, obc: 21, supernumerary: 4 },
  },
  {
    id: 'course-vjti-civil',
    institutionId: 'inst-5',
    courseCode: 'BTECH-CIVIL',
    courseName: 'B.Tech in Civil Engineering',
    degreeLevel: 'UG',
    approvedIntake: 60,
    categoryBreakdown: { general: 30, ews: 6, sc: 9, st: 5, obc: 16, supernumerary: 3 },
    actualEnrolled: 59,
    enrolledByCategory: { general: 30, ews: 6, sc: 9, st: 5, obc: 16, supernumerary: 3 },
  },

  // Anna University CEG Courses
  {
    id: 'course-ceg-cse',
    institutionId: 'inst-6',
    courseCode: 'BTECH-CSE',
    courseName: 'B.E. in Computer Science & Engineering',
    degreeLevel: 'UG',
    approvedIntake: 160,
    categoryBreakdown: { general: 80, ews: 16, sc: 24, st: 12, obc: 43, supernumerary: 8 },
    actualEnrolled: 159,
    enrolledByCategory: { general: 80, ews: 16, sc: 24, st: 12, obc: 43, supernumerary: 7 },
  },
  {
    id: 'course-ceg-ece',
    institutionId: 'inst-6',
    courseCode: 'BTECH-ECE',
    courseName: 'B.E. in Electronics & Communication',
    degreeLevel: 'UG',
    approvedIntake: 160,
    categoryBreakdown: { general: 80, ews: 16, sc: 24, st: 12, obc: 43, supernumerary: 8 },
    actualEnrolled: 159,
    enrolledByCategory: { general: 79, ews: 16, sc: 24, st: 12, obc: 44, supernumerary: 8 },
  },
];

// Seed students with intentional anomalies for demo
const ANOMALY_STUDENTS: StudentRecord[] = [
  // 1. Clean student (Demo User 1)
  {
    id: 'stud-clean-1',
    apaarId: '9845-2134-7712',
    fullName: 'Rohit Sharma',
    dateOfBirth: '2004-05-12',
    gender: 'Male',
    email: 'rohit.sharma@student.ac.in',
    phone: '9876543210',
    institutionId: 'inst-1',
    courseId: 'course-iitd-cse',
    admissionYear: 2024,
    admissionDate: '2024-07-28',
    seatCategory: 'General',
    status: 'Verified',
    reconciliationStatus: 'Matched',
    academicRecord: {
      cgpa: 9.15,
      percentage: 88.4,
      semester: 4,
      backlogs: 0,
      verifiedBy: 'IIT Delhi Academic Registrar (Autonomous)',
      verifiedAt: '2024-08-01T10:00:00Z',
    },
    qualifications: {
      tenthBoard: 'CBSE - Delhi Central',
      tenthYear: 2020,
      tenthScore: '96.2%',
      twelfthBoard: 'CBSE - Delhi Central',
      twelfthYear: 2022,
      twelfthScore: '95.8%',
      entranceExam: 'JEE Advanced',
      entranceRank: 312,
    },
    simulatedReference: {
      fullName: 'Rohit Sharma',
      dateOfBirth: '2004-05-12',
      gender: 'Male',
      fatherName: 'Suresh Sharma',
      aadhaarLinked: true,
      abcAccountId: 'ABC-DL-2024-99812',
      source: 'Academic Bank of Credits (ABC) / DigiLocker National Mock Service',
    },
  },

  // 2. Flagged student with DOB Mismatch (Demo User 2)
  {
    id: 'stud-flag-dob',
    apaarId: '8812-4432-1099',
    fullName: 'Priya Verma',
    dateOfBirth: '2004-09-15', // Institutional record: 15 Sep 2004
    gender: 'Female',
    email: 'priya.verma@student.ac.in',
    phone: '9833445566',
    institutionId: 'inst-1',
    courseId: 'course-iitd-cse',
    admissionYear: 2024,
    admissionDate: '2024-07-29',
    seatCategory: 'General',
    status: 'NeedsCorrection',
    flagReason: 'Reconciliation Discrepancy: Date of Birth mismatch with Central DigiLocker Registry (College: 15-09-2004 vs Registry: 05-09-2004)',
    flagType: 'DataMismatch',
    reconciliationStatus: 'Discrepancy',
    reconciliationDiscrepancies: [
      'Field: Date of Birth (College record: 2004-09-15 vs National Registry: 2004-09-05)',
    ],
    academicRecord: {
      cgpa: 8.82,
      percentage: 84.1,
      semester: 4,
      backlogs: 0,
      verifiedBy: 'Pending Institution Correction Approval',
    },
    qualifications: {
      tenthBoard: 'ICSE Board',
      tenthYear: 2020,
      tenthScore: '94.6%',
      twelfthBoard: 'ISC Board',
      twelfthYear: 2022,
      twelfthScore: '93.2%',
      entranceExam: 'JEE Advanced',
      entranceRank: 588,
    },
    simulatedReference: {
      fullName: 'Priya Verma',
      dateOfBirth: '2004-09-05', // Official record is 05 Sep 2004!
      gender: 'Female',
      fatherName: 'Rajesh Verma',
      aadhaarLinked: true,
      abcAccountId: 'ABC-DL-2024-44109',
      source: 'Academic Bank of Credits (ABC) / DigiLocker National Mock Service',
    },
  },

  // 3. Missing APAAR ID 1 (IIT Delhi)
  {
    id: 'stud-missing-1',
    apaarId: '', // Missing ID
    fullName: 'Aarav K. Mehta',
    dateOfBirth: '2003-08-14',
    gender: 'Male',
    email: 'aarav.mehta@student.ac.in',
    phone: '9822334455',
    institutionId: 'inst-1',
    courseId: 'course-iitd-cse',
    admissionYear: 2024,
    admissionDate: '2024-07-30',
    seatCategory: 'General',
    status: 'Flagged',
    flagReason: 'Missing Mandatory Identifier: APAAR ID is blank. Central validation requires 12-digit permanent academic identity.',
    flagType: 'MissingId',
    reconciliationStatus: 'Unlinked',
    academicRecord: {
      cgpa: 8.4,
      percentage: 80.5,
      semester: 4,
      backlogs: 0,
      verifiedBy: 'Unverified (Missing APAAR)',
    },
    qualifications: {
      tenthBoard: 'CBSE',
      tenthYear: 2019,
      tenthScore: '91.4%',
      twelfthBoard: 'CBSE',
      twelfthYear: 2021,
      twelfthScore: '90.2%',
      entranceExam: 'JEE Advanced',
      entranceRank: 1240,
    },
  },

  // 4. Missing APAAR ID 2 (RV College)
  {
    id: 'stud-missing-2',
    apaarId: '', // Missing ID
    fullName: 'Ananya Swaminathan',
    dateOfBirth: '2004-03-21',
    gender: 'Female',
    email: 'ananya.s@rvce.edu.in',
    phone: '9845012345',
    institutionId: 'inst-4',
    courseId: 'course-rvce-ise',
    admissionYear: 2024,
    admissionDate: '2024-08-05',
    seatCategory: 'General',
    status: 'Flagged',
    flagReason: 'Missing Mandatory Identifier: APAAR ID was not supplied during batch enrolment import.',
    flagType: 'MissingId',
    reconciliationStatus: 'Unlinked',
    academicRecord: {
      cgpa: 9.02,
      percentage: 86.8,
      semester: 4,
      backlogs: 0,
      verifiedBy: 'Unverified',
    },
    qualifications: {
      tenthBoard: 'Karnataka State Board',
      tenthYear: 2020,
      tenthScore: '95.0%',
      twelfthBoard: 'Karnataka PU Board',
      twelfthYear: 2022,
      twelfthScore: '94.5%',
      entranceExam: 'KCET',
      entranceRank: 142,
    },
  },

  // 5 & 6: Duplicate APAAR ID Cluster across two conflicting students at COEP
  {
    id: 'stud-dup-1',
    apaarId: '9923-4810-5511', // Clashing APAAR ID
    fullName: 'Vikramaditya Rao',
    dateOfBirth: '2004-02-18',
    gender: 'Male',
    email: 'vikram.rao@coeptech.ac.in',
    phone: '9890112233',
    institutionId: 'inst-2',
    courseId: 'course-coep-mech',
    admissionYear: 2024,
    admissionDate: '2024-07-22',
    seatCategory: 'General',
    status: 'Flagged',
    flagReason: 'Duplicate Identifier Collision: APAAR 9923-4810-5511 is simultaneously assigned to student Rohan S. Deshmukh (stud-dup-2).',
    flagType: 'DuplicateId',
    reconciliationStatus: 'Discrepancy',
    academicRecord: {
      cgpa: 8.65,
      percentage: 82.0,
      semester: 4,
      backlogs: 0,
      verifiedBy: 'Flagged by Central Anti-Duplication Engine',
    },
    qualifications: {
      tenthBoard: 'Maharashtra SSC',
      tenthYear: 2020,
      tenthScore: '92.4%',
      twelfthBoard: 'Maharashtra HSC',
      twelfthYear: 2022,
      twelfthScore: '89.6%',
      entranceExam: 'MHT-CET',
      entranceRank: 420,
    },
    simulatedReference: {
      fullName: 'Vikramaditya Rao',
      dateOfBirth: '2004-02-18',
      gender: 'Male',
      fatherName: 'Madhav Rao',
      aadhaarLinked: true,
      abcAccountId: 'ABC-MH-2024-88712',
      source: 'Academic Bank of Credits (ABC) / DigiLocker National Mock Service',
    },
  },
  {
    id: 'stud-dup-2',
    apaarId: '9923-4810-5511', // Clashing APAAR ID with Vikramaditya Rao
    fullName: 'Rohan S. Deshmukh',
    dateOfBirth: '2003-11-09',
    gender: 'Male',
    email: 'rohan.deshmukh@coeptech.ac.in',
    phone: '9823998877',
    institutionId: 'inst-2',
    courseId: 'course-coep-ee',
    admissionYear: 2024,
    admissionDate: '2024-07-25',
    seatCategory: 'General',
    status: 'Flagged',
    flagReason: 'Duplicate Identifier Collision: APAAR 9923-4810-5511 matches another admitted candidate with different identity records.',
    flagType: 'DuplicateId',
    reconciliationStatus: 'Discrepancy',
    academicRecord: {
      cgpa: 7.9,
      percentage: 75.4,
      semester: 4,
      backlogs: 1,
      verifiedBy: 'Flagged by Central Anti-Duplication Engine',
    },
    qualifications: {
      tenthBoard: 'CBSE',
      tenthYear: 2019,
      tenthScore: '88.0%',
      twelfthBoard: 'CBSE',
      twelfthYear: 2021,
      twelfthScore: '84.2%',
      entranceExam: 'MHT-CET',
      entranceRank: 1105,
    },
    simulatedReference: {
      fullName: 'Rohan Sanjay Deshmukh',
      dateOfBirth: '2003-11-09',
      gender: 'Male',
      fatherName: 'Sanjay Deshmukh',
      aadhaarLinked: false,
      abcAccountId: 'ABC-MH-2024-11209',
      source: 'Academic Bank of Credits (ABC) / DigiLocker National Mock Service',
    },
  },

  // 7. Spelling discrepancy student (NITK)
  {
    id: 'stud-mismatch-2',
    apaarId: '7765-3321-9988',
    fullName: 'Kavita R. Nair', // Institutional record
    dateOfBirth: '2003-12-01',
    gender: 'Female',
    email: 'kavita.nair@nitk.edu.in',
    phone: '9844556677',
    institutionId: 'inst-3',
    courseId: 'course-nitk-ece',
    admissionYear: 2024,
    admissionDate: '2024-07-26',
    seatCategory: 'SC',
    status: 'Flagged',
    flagReason: 'Reconciliation Discrepancy: Name spelling variance against DigiLocker Aadhaar eKYC (Submitted: "Kavita R. Nair" vs National KYC: "Kavitha Rajan Nair")',
    flagType: 'DataMismatch',
    reconciliationStatus: 'Discrepancy',
    reconciliationDiscrepancies: [
      'Field: Full Name (Institutional: "Kavita R. Nair" vs National Registry: "Kavitha Rajan Nair")',
    ],
    academicRecord: {
      cgpa: 8.75,
      percentage: 83.2,
      semester: 4,
      backlogs: 0,
      verifiedBy: 'Pending Name Correction Affirmation',
    },
    qualifications: {
      tenthBoard: 'Kerala State Board',
      tenthYear: 2019,
      tenthScore: '98.0%',
      twelfthBoard: 'Kerala Higher Secondary',
      twelfthYear: 2021,
      twelfthScore: '96.5%',
      entranceExam: 'JEE Main',
      entranceRank: 840,
    },
    simulatedReference: {
      fullName: 'Kavitha Rajan Nair',
      dateOfBirth: '2003-12-01',
      gender: 'Female',
      fatherName: 'Rajan Nair',
      aadhaarLinked: true,
      abcAccountId: 'ABC-KL-2024-55410',
      source: 'Academic Bank of Credits (ABC) / DigiLocker National Mock Service',
    },
  },

  // 8. Category Discrepancy (IIT Delhi)
  {
    id: 'stud-mismatch-3',
    apaarId: '6612-9901-4433',
    fullName: 'Arjun Patel',
    dateOfBirth: '2004-03-30',
    gender: 'Male',
    email: 'arjun.patel@student.ac.in',
    phone: '9866778899',
    institutionId: 'inst-1',
    courseId: 'course-iitd-ee',
    admissionYear: 2024,
    admissionDate: '2024-07-27',
    seatCategory: 'EWS', // College put him under EWS
    status: 'Flagged',
    flagReason: 'Seat Category Discrepancy: Admitted under Economically Weaker Section (EWS) quota but National Database indicates General Category without active EWS certificate.',
    flagType: 'DataMismatch',
    reconciliationStatus: 'Discrepancy',
    reconciliationDiscrepancies: [
      'Field: Seat Category (Institutional: EWS vs National Verification: General / Certificate Expired)',
    ],
    academicRecord: {
      cgpa: 8.35,
      percentage: 79.5,
      semester: 4,
      backlogs: 0,
      verifiedBy: 'Flagged for AICTE Seat Audit',
    },
    qualifications: {
      tenthBoard: 'Gujarat Board',
      tenthYear: 2020,
      tenthScore: '93.1%',
      twelfthBoard: 'Gujarat Board',
      twelfthYear: 2022,
      twelfthScore: '91.8%',
      entranceExam: 'JEE Advanced',
      entranceRank: 1640,
    },
    simulatedReference: {
      fullName: 'Arjun Patel',
      dateOfBirth: '2004-03-30',
      gender: 'Male',
      fatherName: 'Dharmesh Patel',
      aadhaarLinked: true,
      abcAccountId: 'ABC-GJ-2024-77192',
      source: 'Academic Bank of Credits (ABC) / DigiLocker National Mock Service',
    },
  },
];

// Helper to generate realistic students across institutions to reach ~300 students
function generateRemainingStudents(): StudentRecord[] {
  const firstNames = [
    'Aaditya', 'Abhishek', 'Aditi', 'Alok', 'Amit', 'Ananya', 'Anil', 'Aniruddh', 'Anjali', 'Ankita',
    'Arnav', 'Aryan', 'Ayush', 'Bhavna', 'Chetan', 'Dev', 'Dhruv', 'Divya', 'Gaurav', 'Harish',
    'Isha', 'Ishaan', 'Kartik', 'Kunal', 'Manish', 'Meera', 'Mohit', 'Neha', 'Nikhil', 'Nisha',
    'Pooja', 'Pranav', 'Pratik', 'Priya', 'Rahul', 'Rhea', 'Rishi', 'Ritu', 'Sachin', 'Sai',
    'Sameer', 'Sanjay', 'Sarita', 'Saurabh', 'Shreya', 'Sneha', 'Sourabh', 'Suhani', 'Tanvi', 'Tarun',
    'Utkarsh', 'Varun', 'Vidya', 'Vikas', 'Vishal', 'Yash', 'Zoya', 'Tanmay', 'Siddharth', 'Nandini'
  ];

  const lastNames = [
    'Agarwal', 'Banerjee', 'Bhatt', 'Chakraborty', 'Chauhan', 'Das', 'Desai', 'Dutta', 'Gupta', 'Iyer',
    'Jadhav', 'Jain', 'Jha', 'Joshi', 'Kapoor', 'Khan', 'Kulkarni', 'Kumar', 'Malhotra', 'Mishra',
    'Mukherjee', 'Nair', 'Pandey', 'Patel', 'Pillai', 'Prasad', 'Rao', 'Reddy', 'Roy', 'Sen',
    'Sharma', 'Singh', 'Srivastava', 'Tiwari', 'Tripathi', 'Varma', 'Verma', 'Yadav', 'Kaur', 'Menon'
  ];

  const categories: StudentRecord['seatCategory'][] = ['General', 'General', 'OBC', 'OBC', 'SC', 'ST', 'EWS', 'Supernumerary'];
  const generated: StudentRecord[] = [];

  let idCounter = 100;

  // Distribute among courses
  INITIAL_COURSES.forEach((course) => {
    // For IIT Delhi CSE, we already have 4 students in ANOMALY_STUDENTS (Rohit, Priya, Aarav, plus 1 more)
    // We need total actualEnrolled = course.actualEnrolled
    const existingCount = ANOMALY_STUDENTS.filter(s => s.courseId === course.id).length;
    const targetForCourse = Math.min(course.actualEnrolled - existingCount, 25); // distribute sample

    for (let i = 0; i < targetForCourse; i++) {
      idCounter++;
      const fName = firstNames[(idCounter * 7 + i) % firstNames.length];
      const lName = lastNames[(idCounter * 11 + i) % lastNames.length];
      const fullName = `${fName} ${lName}`;
      const birthYear = 2003 + (i % 3);
      const birthMonth = String((i % 12) + 1).padStart(2, '0');
      const birthDay = String((i % 28) + 1).padStart(2, '0');
      const dob = `${birthYear}-${birthMonth}-${birthDay}`;
      const gender: 'Male' | 'Female' = i % 3 === 0 ? 'Female' : 'Male';
      const category = categories[i % categories.length];

      // Form 12 digit pseudo-random APAAR
      const apaarRaw = `${String(1000 + (idCounter * 19) % 9000)}${String(2000 + (idCounter * 23) % 8000)}${String(1000 + (idCounter * 31) % 9000)}`;
      const apaarFormatted = `${apaarRaw.slice(0, 4)}-${apaarRaw.slice(4, 8)}-${apaarRaw.slice(8, 12)}`;

      const cgpa = Number((7.2 + ((idCounter % 28) / 10)).toFixed(2));
      const percentage = Number((68 + ((idCounter % 300) / 10)).toFixed(1));

      generated.push({
        id: `stud-gen-${idCounter}`,
        apaarId: apaarFormatted,
        fullName,
        dateOfBirth: dob,
        gender,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${idCounter % 99}@student.ac.in`,
        phone: `98${String(10000000 + (idCounter * 9371) % 90000000)}`,
        institutionId: course.institutionId,
        courseId: course.id,
        admissionYear: 2024,
        admissionDate: `2024-07-${String(15 + (i % 14)).padStart(2, '0')}`,
        seatCategory: category,
        status: 'Verified',
        reconciliationStatus: 'Matched',
        academicRecord: {
          cgpa: Math.min(cgpa, 9.8),
          percentage: Math.min(percentage, 97.5),
          semester: 4,
          backlogs: i % 15 === 0 ? 1 : 0,
          verifiedBy: 'AICTE Institution Academic Cell',
          verifiedAt: '2024-08-01T10:00:00Z',
        },
        qualifications: {
          tenthBoard: i % 2 === 0 ? 'CBSE' : 'State Board',
          tenthYear: birthYear + 16,
          tenthScore: `${85 + (i % 14)}%`,
          twelfthBoard: i % 2 === 0 ? 'CBSE' : 'State Board',
          twelfthYear: birthYear + 18,
          twelfthScore: `${83 + (i % 15)}%`,
          entranceExam: course.degreeLevel === 'PG' ? 'GATE' : 'JEE / State CET',
          entranceRank: 200 + (idCounter * 17) % 5000,
        },
        simulatedReference: {
          fullName,
          dateOfBirth: dob,
          gender,
          fatherName: `${firstNames[(i + 5) % firstNames.length]} ${lName}`,
          aadhaarLinked: true,
          abcAccountId: `ABC-NAT-2024-${idCounter}`,
          source: 'Academic Bank of Credits (ABC) / DigiLocker National Mock Service',
        },
      });
    }
  });

  return generated;
}

export const INITIAL_STUDENTS: StudentRecord[] = [
  ...ANOMALY_STUDENTS,
  ...generateRemainingStudents(),
];

export const INITIAL_CORRECTIONS: CorrectionRequest[] = [
  {
    id: 'corr-1',
    studentId: 'stud-flag-dob',
    studentName: 'Priya Verma',
    apaarId: '8812-4432-1099',
    institutionId: 'inst-1',
    courseName: 'B.Tech in Computer Science & Engineering',
    fieldToCorrect: 'dateOfBirth',
    currentValue: '2004-09-15',
    requestedValue: '2004-09-05',
    reason: 'Typographical error by admission data-entry operator. Official Class 10 certificate and DigiLocker record confirm 05-Sep-2004.',
    documentName: 'Priya_Verma_Class10_Certificate.pdf',
    status: 'Requested',
    createdAt: '2024-08-10T14:30:00Z',
    updatedAt: '2024-08-10T14:30:00Z',
  },
  {
    id: 'corr-2',
    studentId: 'stud-clean-1',
    studentName: 'Rohit Sharma',
    apaarId: '9845-2134-7712',
    institutionId: 'inst-1',
    courseName: 'B.Tech in Computer Science & Engineering',
    fieldToCorrect: 'email',
    currentValue: 'rohit.s.old@gmail.com',
    requestedValue: 'rohit.sharma@student.ac.in',
    reason: 'Updated to institutional official academic email address.',
    status: 'Updated',
    institutionRemarks: 'Institutional email verified and updated by Registrar on 02-Aug-2024.',
    createdAt: '2024-08-01T11:00:00Z',
    updatedAt: '2024-08-02T09:15:00Z',
  },
];

export const INITIAL_PASSPORTS: AcademicPassport[] = [
  {
    id: 'pass-demo-1',
    token: 'rohit-iitd-verified-token',
    studentId: 'stud-clean-1',
    studentName: 'Rohit Sharma',
    apaarId: '9845-2134-7712',
    institutionName: 'Indian Institute of Technology Delhi',
    courseName: 'B.Tech in Computer Science & Engineering',
    admissionYear: 2024,
    recipientName: 'Vikram Seth',
    recipientOrganization: 'Tata Consultancy Services - Research & Innovation Lab',
    sharedFields: {
      institutionAndCourse: true,
      admissionDetails: true,
      academicQualifications: true,
      verifiedGrades: true,
      attendanceStatus: false,
    },
    verifiedBadges: {
      institutionAndCourse: {
        status: 'Verified',
        source: 'AICTE Institution Master Registry',
        verifiedAt: '2024-08-01T10:00:00Z',
      },
      admissionDetails: {
        status: 'Verified',
        source: 'IIT Delhi Admission Cell Ledger',
        verifiedAt: '2024-07-28T14:20:00Z',
      },
      academicQualifications: {
        status: 'Verified',
        source: 'DigiLocker / CBSE Central Board Sync',
        verifiedAt: '2024-08-02T11:45:00Z',
      },
      verifiedGrades: {
        status: 'Verified',
        source: 'Autonomous Academic Exam Portal (Autonomous Grading)',
        verifiedAt: '2024-08-05T16:00:00Z',
      },
      unverifiedExtracurricular: {
        status: 'Unverified',
        source: 'Student Self-Declared (Unverified)',
      },
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    createdAt: new Date().toISOString(),
    isRevoked: false,
    viewsCount: 3,
    lastViewedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2024-08-10T14:30:00Z',
    actorId: 'usr-student-2',
    actorName: 'Priya Verma',
    actorRole: 'student',
    action: 'CORRECTION_REQUESTED',
    target: 'Student Record #stud-flag-dob (DOB)',
    details: 'Submitted formal correction request for Date of Birth to IIT Delhi Academic Cell.',
    ipAddress: '14.139.224.12',
  },
  {
    id: 'log-2',
    timestamp: '2024-08-10T12:15:00Z',
    actorId: 'usr-recruiter-1',
    actorName: 'Vikram Seth (TCS Talent)',
    actorRole: 'recruiter',
    action: 'PASSPORT_VERIFIED',
    target: 'Passport Token: rohit-iitd-verified-token',
    details: 'Opened and inspected verified academic credentials of student Rohit Sharma via token link.',
    ipAddress: '115.112.98.54',
  },
  {
    id: 'log-3',
    timestamp: '2024-08-10T10:05:00Z',
    actorId: 'usr-inst-1',
    actorName: 'Dr. R. K. Mittal (IIT Delhi Registrar)',
    actorRole: 'institution',
    action: 'REVEAL_APAAR',
    target: 'StudentRecord: Rohit Sharma (stud-clean-1)',
    details: 'Unmasked complete 12-digit APAAR identifier for administrative enrollment ledger check.',
    ipAddress: '10.24.8.101',
  },
  {
    id: 'log-4',
    timestamp: '2024-08-09T16:40:00Z',
    actorId: 'usr-inst-1',
    actorName: 'Dr. R. K. Mittal (IIT Delhi Registrar)',
    actorRole: 'institution',
    action: 'UPLOAD_BATCH',
    target: 'Batch Upload: 2024_admissions_btech_v1.csv',
    details: 'Processed 120 admission records. 118 verified, 2 flagged for validation issues.',
    ipAddress: '10.24.8.101',
  },
  {
    id: 'log-5',
    timestamp: '2024-08-08T09:20:00Z',
    actorId: 'usr-aicte-1',
    actorName: 'Dr. Sunita Murthy (AICTE Approvals)',
    actorRole: 'aicte',
    action: 'FLAG_RESOLVED',
    target: 'Institution COEP Tech (Intake Compliance Review)',
    details: 'Initiated formal compliance enquiry regarding B.Tech Electrical 61/60 excess seat allocation.',
    ipAddress: '164.100.58.21',
  },
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr-inst-1',
    name: 'Dr. R. K. Mittal',
    email: 'inst.admin@iitd.ac.in',
    role: 'institution',
    institutionId: 'inst-1',
    designation: 'Registrar & AICTE Nodal Officer',
    department: 'Academic Affairs, IIT Delhi',
  },
  {
    id: 'usr-aicte-1',
    name: 'Dr. Sunita Murthy',
    email: 'officer.aicte@gov.in',
    role: 'aicte',
    designation: 'Director of Approvals & Compliance',
    department: 'AICTE Headquarters, New Delhi',
  },
  {
    id: 'usr-student-1',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@student.ac.in',
    role: 'student',
    institutionId: 'inst-1',
    apaarId: '9845-2134-7712',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-student-2',
    name: 'Priya Verma',
    email: 'priya.verma@student.ac.in',
    role: 'student',
    institutionId: 'inst-1',
    apaarId: '8812-4432-1099',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'usr-recruiter-1',
    name: 'Vikram Seth',
    email: 'talent@tcs.com',
    role: 'recruiter',
    designation: 'Lead University Talent Partner',
    organization: 'Tata Consultancy Services',
  },
];
