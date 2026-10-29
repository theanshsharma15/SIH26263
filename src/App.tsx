import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { NotFound } from './pages/public/NotFound';
import { VerifyEntryPage } from './pages/recruiter/VerifyEntryPage';
import { VerifyTokenPage } from './pages/recruiter/VerifyTokenPage';

// Layouts
import { InstitutionLayout } from './layouts/InstitutionLayout';
import { AicteLayout } from './layouts/AicteLayout';
import { StudentLayout } from './layouts/StudentLayout';

// Institution pages
import { InstitutionDashboard } from './pages/institution/InstitutionDashboard';
import { UploadRecords } from './pages/institution/UploadRecords';
import { StudentRecords } from './pages/institution/StudentRecords';
import { ValidationIssues } from './pages/institution/ValidationIssues';
import { SeatLedger } from './pages/institution/SeatLedger';
import { CorrectionsQueue } from './pages/institution/CorrectionsQueue';
import { ReportsPage } from './pages/institution/ReportsPage';
import { AuditLogPage } from './pages/institution/AuditLogPage';

// AICTE pages
import { AicteOverview } from './pages/aicte/AicteOverview';
import { InstitutionsList } from './pages/aicte/InstitutionsList';
import { DynamicSeatComplianceLedger } from './pages/aicte/DynamicSeatComplianceLedger';
import { ApaarReconciliation } from './pages/aicte/ApaarReconciliation';
import { FlaggedCases } from './pages/aicte/FlaggedCases';
import { AicteReports } from './pages/aicte/AicteReports';
import { AicteAuditLogsPage } from './pages/aicte/AuditLogsPage';

// Student pages
import { MyRecord } from './pages/student/MyRecord';
import { CorrectionsTracker } from './pages/student/CorrectionsTracker';
import { VerifiedPassport } from './pages/student/VerifiedPassport';
import { SharingHistory } from './pages/student/SharingHistory';
import { ConsentManager } from './pages/student/ConsentManager';

export function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<VerifyEntryPage />} />
          <Route path="/verify/:token" element={<VerifyTokenPage />} />

          {/* Institution Portal (Protected) */}
          <Route
            path="/institution"
            element={
              <ProtectedRoute allowedRoles={['institution']}>
                <InstitutionLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/institution/dashboard" replace />} />
            <Route path="dashboard" element={<InstitutionDashboard />} />
            <Route path="upload" element={<UploadRecords />} />
            <Route path="records" element={<StudentRecords />} />
            <Route path="issues" element={<ValidationIssues />} />
            <Route path="seat-ledger" element={<SeatLedger />} />
            <Route path="corrections" element={<CorrectionsQueue />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit-log" element={<AuditLogPage />} />
          </Route>

          {/* AICTE Regulatory Dashboard (Protected) */}
          <Route
            path="/aicte"
            element={
              <ProtectedRoute allowedRoles={['aicte']}>
                <AicteLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/aicte/overview" replace />} />
            <Route path="overview" element={<AicteOverview />} />
            <Route path="institutions" element={<InstitutionsList />} />
            <Route path="seat-ledger" element={<DynamicSeatComplianceLedger />} />
            <Route path="reconciliation" element={<ApaarReconciliation />} />
            <Route path="flagged-cases" element={<FlaggedCases />} />
            <Route path="reports" element={<AicteReports />} />
            <Route path="audit-logs" element={<AicteAuditLogsPage />} />
          </Route>

          {/* Student Transparency Portal (Protected) */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/my-record" replace />} />
            <Route path="my-record" element={<MyRecord />} />
            <Route path="corrections" element={<CorrectionsTracker />} />
            <Route path="passport" element={<VerifiedPassport />} />
            <Route path="sharing-history" element={<SharingHistory />} />
            <Route path="consent" element={<ConsentManager />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
