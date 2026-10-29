import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Users,
  AlertTriangle,
  Layers,
  FileEdit,
  FileSpreadsheet,
  History,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { PrototypeBanner } from '../components/common/PrototypeBanner';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DemoGuide } from '../components/common/DemoGuide';
import { useAppStore } from '../store/useAppStore';

export const InstitutionLayout: React.FC = () => {
  const { currentUser, institutions, courses, corrections } = useAppStore();
  const currentInst = institutions.find((i) => i.id === currentUser?.institutionId) || institutions[0];
  const pendingCorrectionsCount = corrections.filter(
    (c) => c.institutionId === currentInst.id && c.status === 'Requested'
  ).length;

  const navItems = [
    { label: 'Dashboard', path: '/institution/dashboard', icon: LayoutDashboard },
    { label: 'Upload Records', path: '/institution/upload', icon: UploadCloud },
    { label: 'Student Records', path: '/institution/records', icon: Users },
    { label: 'Validation Issues', path: '/institution/issues', icon: AlertTriangle },
    { label: 'Seat Ledger', path: '/institution/seat-ledger', icon: Layers },
    {
      label: 'Corrections Queue',
      path: '/institution/corrections',
      icon: FileEdit,
      badge: pendingCorrectionsCount > 0 ? pendingCorrectionsCount : undefined,
    },
    { label: 'Reports', path: '/institution/reports', icon: FileSpreadsheet },
    { label: 'Audit Log', path: '/institution/audit-log', icon: History },
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
            {/* Institution Badge Card */}
            <div className="p-4 bg-gradient-to-br from-gov-navy-900 to-gov-navy-800 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 bg-gov-saffron-500 rounded-lg text-white">
                  <Building2 className="w-4 h-4" />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gov-saffron-300">
                  Institution Portal
                </span>
              </div>
              <h2 className="font-extrabold text-sm leading-snug truncate" title={currentInst.name}>
                {currentInst.name}
              </h2>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                AICTE ID: {currentInst.aicteId}
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
                          ? 'bg-gov-navy-50 text-gov-navy-900 font-bold border-l-4 border-gov-saffron-500 shadow-xs'
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
