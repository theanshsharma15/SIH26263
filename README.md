# APAAR-Based Student Data Management and Verification Platform
### Smart India Hackathon 2026 — Problem Statement 26263 (AICTE)
**Organization:** All India Council for Technical Education (AICTE)  
**Theme:** Smart Automation | **Category:** Software  
**Design Standard:** Guidelines for Indian Government Websites (GIGW 3.0) & WCAG 2.1 AA  

---

## 📌 Executive Summary

AICTE-approved institutions maintain student admission records across diverse departments, courses, and seat categories. Incomplete records, duplicate entries across institutions, missing or invalid 12-digit APAAR IDs, and manual verification challenges have historically caused administrative delays and excess-intake compliance issues.

This platform provides a unified, government-grade solution built on the **Automated Permanent Academic Account Registry (APAAR)**:
1. **Dynamic Seat-Compliance Ledger**: Real-time tracking of approved intake vs actual admissions with instant alarms upon excess admission attempts.
2. **APAAR Data Reconciliation Engine**: Multi-pass validation identifying missing IDs, duplicate student clusters across institutions, and field-level discrepancies against DigiLocker/ABC registries.
3. **Student Record Transparency Portal**: Read-only transparency for students to track verification status and submit correction requests to their institutions (students cannot edit or self-certify records).
4. **Verified Academic Passport**: Privacy-first, student-generated, time-limited sharing links and QR codes displaying verified badges to recruiters without exposing raw confidential files.

---

## 🚀 Quick Start Instructions

Ensure Node.js (v18+) is installed. Run the following commands:

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

The application will start at `http://localhost:5173`. Open this URL in any modern browser.

---

## 🔑 Demo Personas & Pre-Loaded Credentials

For rapid evaluation, the login modal provides **1-Click Demo Login** buttons. You can also switch roles at any time from the top-right user menu or the floating **SIH 2026 Demo Guide** in the bottom-right corner.

| Role | Name | Email | Credentials / Context |
| :--- | :--- | :--- | :--- |
| **Institution Admin** | Dr. R. K. Mittal | `inst.admin@iitd.ac.in` | IIT Delhi (AICTE ID: `1-332014501`) |
| **AICTE Official** | Dr. Sunita Murthy | `officer.aicte@gov.in` | Director of Approvals & Compliance |
| **Student (Clean)** | Rohit Sharma | `rohit.sharma@student.ac.in` | APAAR: `9845-2134-7712` (Verified) |
| **Student (Flagged)**| Priya Verma | `priya.verma@student.ac.in` | APAAR: `8812-4432-1099` (DOB Mismatch) |
| **Recruiter / Verifier**| Vikram Seth | `talent@tcs.com` | Lead University Talent Partner, TCS |

*Note: For student login, a simulated Multi-Factor Authentication (OTP: `123456`) step is provided.*

---

## 📋 10-Step Evaluator Demo Flow

A floating, collapsible **Demo Guide** is available in the bottom-right corner of every screen with one-click navigation:

1. **Batch Upload**: Navigate to `/institution/upload`. Click **Load Pre-Packaged Demo CSV** (or upload `public/sample_students.csv`).
2. **Observe Validation**: Notice the instantaneous detection of Row #4 (missing APAAR ID) and Row #7 (duplicate APAAR collision with conflicting student identity).
3. **Inline Fix & Re-Validate**: Click **Fix** on Row #4, generate/enter a valid 12-digit APAAR ID (`9845-2134-8899`), click **Save**, and click **Commit Clean Records**.
4. **Seat Ledger Inspection**: Navigate to `/institution/seat-ledger`. Notice B.Tech CSE is at 118/120 admissions (only 2 seats remaining).
5. **AICTE Real-Time Excess Warning**: Switch to AICTE Official (`/aicte/seat-ledger`). Click **Simulate New Admission** on IIT Delhi CSE. Watch it update to 119, then 120, then 121 — firing an instantaneous **Live Excess Admission Breach Warning**!
6. **Reconciliation Engine**: Open `/aicte/reconciliation`. View the side-by-side comparison between Priya Verma's submitted college record (`2004-09-15`) vs DigiLocker/ABC national reference record (`2004-09-05`). Switch to **Duplicate Clusters** to inspect the clashing APAAR `9923-4810-5511`.
7. **Student Transparency**: Switch to student Priya Verma (`/student/my-record`). Observe the plain-language discrepancy explanation. Verify the security guard: students cannot independently edit official records; they can only submit a formal correction request.
8. **Verified Academic Passport**: Switch to student Rohit Sharma (`/student/passport`). Select permitted fields (Degree, Grades, Qualifications), choose a 24-hour validity window, accept mandatory privacy consent, and generate a QR code + secure link.
9. **Recruiter Verification**: Open the link or navigate to `/verify/rohit-iitd-verified-token`. Inspect verified vs unverified badges, verification dates, countdown timer, and statutory disclaimer.
10. **Immutable Audit Trail**: Switch to AICTE Official (`/aicte/audit-logs`). Verify that every upload, unmasking, correction, and recruiter view was cryptographically logged with actor IDs and timestamps.

---

## 🏛️ GIGW & WCAG 2.1 AA Accessibility Features

- **Tricolour National Strip**: Saffron (`#FF9933`), White (`#FFFFFF`), Green (`#138808`) banner at the top edge.
- **Accessibility Utility Bar**:
  - `Skip to main content` keyboard shortcut.
  - Interactive Text Size Adjustment (`A-`, `A`, `A+`) modifying root scale.
  - High Contrast Toggle switching to compliant high-contrast theme.
  - Bilingual Toggle (`English` / `हिन्दी`).
  - Screen-reader ARIA live announcements.
- **Simulated Badges**: Every simulation check explicitly carries a "Simulated" badge in compliance with hackathon prototype guidelines.

---

## 🔒 Security & Privacy Implementation

- **APAAR ID Masking**: Default display masks all but the last 4 digits (`XXXX-XXXX-1234`). Clicking the eye icon unmasks the ID and triggers an audit log entry.
- **Consent-Driven Sharing**: Academic Passports require explicit student consent prior to token generation.
- **Time-Bound Revocation**: Sharing links automatically expire after the configured duration (1h, 24h, 7d) and can be revoked by the student at any moment.
- **No Password Assumption**: APAAR ID is never used as an authentication credential. Multi-factor verification (SSO/OTP) is enforced.

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, React Router v6
- **Styling**: Tailwind CSS, Lucide React Icons
- **Data Visualizations**: Recharts
- **QR Generation**: QRCode.react
- **File Parsing**: PapaParse (CSV), SheetJS / XLSX (Excel)
- **State & Storage**: Zustand with LocalStorage Persistence
- **Mock Service Layer**: `/src/services/mockApi.ts` with simulated network latency
