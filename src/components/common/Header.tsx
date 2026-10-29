import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Globe,
  Sliders,
  CheckCircle2,
  ExternalLink,
  QrCode,
  GraduationCap,
  Building2,
  FileCheck2,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_USERS } from '../../data/seed';
import { SimulatedBadge } from './SimulatedBadge';

interface HeaderProps {
  onOpenLoginModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLoginModal }) => {
  const {
    t,
    textSize,
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
    highContrast,
    toggleHighContrast,
    language,
    toggleLanguage,
  } = useAccessibility();

  const { currentUser, login, logout } = useAppStore();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = (demoUser: typeof DEMO_USERS[0]) => {
    login(demoUser);
    setUserDropdownOpen(false);
    if (demoUser.role === 'institution') navigate('/institution/dashboard');
    else if (demoUser.role === 'aicte') navigate('/aicte/overview');
    else if (demoUser.role === 'student') navigate('/student/my-record');
    else if (demoUser.role === 'recruiter') navigate('/verify');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'aicte':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'institution':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'student':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'recruiter':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. National Tricolour Strip (GIGW Mandate) */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" title="Saffron - Courage and Sacrifice" />
        <div className="h-full w-1/3 bg-white" title="White - Truth, Peace and Purity" />
        <div className="h-full w-1/3 bg-[#138808]" title="Green - Prosperity and Faith" />
      </div>

      {/* 2. GIGW Accessibility & Utility Bar */}
      <div className="bg-slate-100 border-b border-slate-200 py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Skip link for screen readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-gov-saffron-500 focus:text-white focus:rounded focus:shadow-lg focus:font-bold"
          >
            {t('skipToMain')}
          </a>

          <div className="hidden sm:flex items-center gap-2 text-slate-600 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-gov-green-500 animate-pulse"></span>
            <span>{t('nationalPortal')}</span>
          </div>

          {/* Accessibility controls */}
          <div className="flex items-center gap-3 ml-auto text-slate-700">
            {/* Font size adjustment */}
            <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden" title="Text Size Adjuster">
              <button
                onClick={decreaseTextSize}
                aria-label="Decrease text size"
                className={`px-1.5 py-0.5 hover:bg-slate-100 text-[11px] font-bold ${textSize === 'normal' ? 'opacity-40' : ''}`}
              >
                A-
              </button>
              <button
                onClick={resetTextSize}
                aria-label="Reset text size"
                className={`px-1.5 py-0.5 hover:bg-slate-100 text-[11px] font-bold border-x border-slate-200 ${textSize === 'normal' ? 'bg-slate-200' : ''}`}
              >
                A
              </button>
              <button
                onClick={increaseTextSize}
                aria-label="Increase text size"
                className={`px-1.5 py-0.5 hover:bg-slate-100 text-[11px] font-bold ${textSize === 'xlarge' ? 'opacity-40' : ''}`}
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold transition-colors ${
                highContrast
                  ? 'bg-black text-yellow-300 border-yellow-400'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>{t('highContrast')}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language between English and Hindi"
              className="flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700"
            >
              <Globe className="w-3 h-3 text-gov-navy-600" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Government Brand Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Emblem & Portal Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          {/* Neutral Emblem Placeholder */}
          <div
            className="w-12 h-12 rounded-lg bg-gov-navy-50 border border-gov-navy-200 flex flex-col items-center justify-center p-1 text-gov-navy-700 shadow-xs group-hover:border-gov-saffron-500 transition-colors shrink-0"
            title="AICTE Apex Regulatory Body (National Simulation)"
          >
            <Shield className="w-6 h-6 text-gov-navy-600" />
            <span className="text-[7px] uppercase font-black tracking-tight text-gov-navy-800">AICTE</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg lg:text-xl font-extrabold text-gov-navy-900 tracking-tight leading-tight group-hover:text-gov-navy-700">
                {t('portalTitle')}
              </h1>
              <SimulatedBadge size="sm" />
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {t('portalSubtitle')} • <span className="text-gov-saffron-600 font-bold">SIH 2026 PS-26263</span>
            </p>
          </div>
        </Link>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/verify"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verify a Passport</span>
          </Link>

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-gov-navy-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[130px] leading-tight">{currentUser.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-sm border uppercase font-bold ${getRoleBadge(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <p className="text-[11px] text-gov-navy-600 font-medium mt-0.5">
                      {currentUser.designation || currentUser.department || 'Active Session'}
                    </p>
                  </div>

                  {/* Portal Navigation Link based on role */}
                  <div className="px-2 py-1 border-b border-slate-100">
                    {currentUser.role === 'institution' && (
                      <Link
                        to="/institution/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gov-navy-700 hover:bg-gov-navy-50"
                      >
                        <Building2 className="w-4 h-4 text-gov-navy-600" />
                        <span>Institution Portal Dashboard</span>
                      </Link>
                    )}
                    {currentUser.role === 'aicte' && (
                      <Link
                        to="/aicte/overview"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-50"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span>AICTE Central Intelligence Dashboard</span>
                      </Link>
                    )}
                    {currentUser.role === 'student' && (
                      <Link
                        to="/student/my-record"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                        <span>Student Transparency Portal</span>
                      </Link>
                    )}
                    {currentUser.role === 'recruiter' && (
                      <Link
                        to="/verify"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50"
                      >
                        <FileCheck2 className="w-4 h-4 text-amber-600" />
                        <span>Recruiter Verification Portal</span>
                      </Link>
                    )}
                  </div>

                  {/* Switch Demo Roles Section */}
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                      Switch Role for Demo
                    </p>
                    <div className="space-y-1">
                      {DEMO_USERS.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleRoleSwitch(u)}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                            currentUser.id === u.id
                              ? 'bg-gov-navy-50 font-bold text-gov-navy-800'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="truncate">
                            <span className="capitalize font-semibold">{u.role}: </span>
                            <span className="text-slate-600 text-[11px]">{u.name}</span>
                          </div>
                          {currentUser.id === u.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-gov-navy-600 shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-gov-navy-600 hover:bg-gov-navy-700 text-white shadow-sm transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{t('login')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
