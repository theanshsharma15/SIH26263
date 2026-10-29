import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Layers,
  GitCompare,
  AlertOctagon,
  FileSpreadsheet,
  History,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { PrototypeBanner } from '../components/common/PrototypeBanner';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DemoGuide } from '../components/common/DemoGuide';
import { useAppStore } from '../store/useAppStore';

export const AicteLayout: React.FC = () => {
  const { students } = useAppStore();
  const flaggedCount = students.filter((s) => s.status === 'Flagged' || s.status === 'NeedsCorrection').length;

  const navItems = [
    { label: 'Overview', path: '/aicte/overview', icon: LayoutDashboard },
    { label: 'Institutions', path: '/aicte/institutions', icon: Building2 },
    { label: 'Seat-Compliance Ledger', path: '/aicte/seat-ledger', icon: Layers, highlight: true },
    { label: 'APAAR Reconciliation', path: '/aicte/reconciliation', icon: GitCompare, highlight: true },
    {
      label: 'Flagged Cases',
      path: '/aicte/flagged-cases',
      icon: AlertOctagon,
      badge: flaggedCount > 0 ? flaggedCount : undefined,
    },
    { label: 'Reports', path: '/aicte/reports', icon: FileSpreadsheet },
    { label: 'Audit Logs', path: '/aicte/audit-logs', icon: History },
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
            {/* AICTE Regulatory Header */}
            <div className="p-4 bg-gradient-to-br from-purple-950 via-gov-navy-900 to-gov-navy-950 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 bg-purple-500 rounded-lg text-white">
                  <Shield className="w-4 h-4" />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                  Regulatory Headquarters
                </span>
              </div>
              <h2 className="font-extrabold text-sm leading-snug">
                AICTE Central Intelligence
              </h2>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                New Delhi • Approval & Enforcement
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
                          ? 'bg-purple-50 text-purple-900 font-bold border-l-4 border-purple-600 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
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
