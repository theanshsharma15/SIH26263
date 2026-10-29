import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  UserCheck,
  FileEdit,
  ShieldCheck,
  History,
  Lock,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { PrototypeBanner } from '../components/common/PrototypeBanner';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DemoGuide } from '../components/common/DemoGuide';
import { useAppStore } from '../store/useAppStore';

export const StudentLayout: React.FC = () => {
  const { currentUser, corrections, students } = useAppStore();
  const currentStudent = students.find((s) => s.apaarId === currentUser?.apaarId) || students[0];
  const pendingCorrections = corrections.filter((c) => c.studentId === currentStudent?.id);

  const navItems = [
    { label: 'My Record', path: '/student/my-record', icon: UserCheck },
    {
      label: 'Corrections Tracker',
      path: '/student/corrections',
      icon: FileEdit,
      badge: pendingCorrections.length > 0 ? pendingCorrections.length : undefined,
    },
    { label: 'Verified Academic Passport', path: '/student/passport', icon: ShieldCheck, highlight: true },
    { label: 'Sharing History', path: '/student/sharing-history', icon: History },
    { label: 'Consent Manager', path: '/student/consent', icon: Lock },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <PrototypeBanner />
      <Header />
      <Breadcrumbs />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sticky Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            {/* Student Profile Header */}
            <div className="p-4 bg-gradient-to-br from-emerald-900 via-gov-navy-900 to-gov-navy-950 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 bg-emerald-500 rounded-lg text-white">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                  Student Transparency
                </span>
              </div>
              <h2 className="font-extrabold text-sm leading-snug">
                {currentUser?.name || currentStudent.fullName}
              </h2>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                APAAR: {currentStudent.apaarId || 'Not Assigned'}
              </p>
            </div>

            {/* Nav list */}
            <nav className="p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-emerald-600 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Student Privacy Safeguard Notice */}
            <div className="p-3 m-2 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-900">
              <p className="font-bold flex items-center gap-1 mb-1">
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>Student Safeguard</span>
              </p>
              <p className="text-slate-600 leading-tight">
                Students can never modify official records or mark data verified. All corrections require institutional verification.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <Footer />
      <DemoGuide />
    </div>
  );
};
