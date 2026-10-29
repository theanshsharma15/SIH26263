import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Shield,
  Building2,
  GraduationCap,
  FileCheck2,
  Lock,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Info,
  Smartphone,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_USERS } from '../../data/seed';
import { UserRole, User } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'institution',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [selectedStudentVariant, setSelectedStudentVariant] = useState<'clean' | 'flagged'>('clean');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  const { login } = useAppStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsOtpStep(false);
    setOtpValue('');
    setOtpError('');
  };

  const getTargetUser = (): User => {
    if (selectedRole === 'institution') return DEMO_USERS[0];
    if (selectedRole === 'aicte') return DEMO_USERS[1];
    if (selectedRole === 'student') {
      return selectedStudentVariant === 'clean' ? DEMO_USERS[2] : DEMO_USERS[3];
    }
    return DEMO_USERS[4]; // recruiter
  };

  const handleProceedLogin = () => {
    if (selectedRole === 'student' && !isOtpStep) {
      // Trigger simulated OTP step
      setIsOtpStep(true);
      return;
    }

    const targetUser = getTargetUser();
    login(targetUser);
    onClose();

    // Redirect to respective dashboard
    if (selectedRole === 'institution') navigate('/institution/dashboard');
    else if (selectedRole === 'aicte') navigate('/aicte/overview');
    else if (selectedRole === 'student') navigate('/student/my-record');
    else if (selectedRole === 'recruiter') navigate('/verify');
  };

  const handleOtpVerify = () => {
    if (otpValue === '123456' || otpValue.length === 6) {
      const targetUser = getTargetUser();
      login(targetUser);
      onClose();
      navigate('/student/my-record');
    } else {
      setOtpError('Invalid OTP. Use demo OTP: 123456');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy-900 text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-saffron-500 rounded-lg text-white">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Secure Government Portal Authentication
              </h3>
              <p className="text-xs text-slate-300">
                APAAR Data & Verification Platform (AICTE Simulation)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isOtpStep ? (
            <>
              {/* Role Selector Tabs */}
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('institution')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedRole === 'institution'
                      ? 'border-gov-navy-600 bg-gov-navy-50 text-gov-navy-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Building2 className={`w-5 h-5 ${selectedRole === 'institution' ? 'text-gov-navy-600' : 'text-slate-400'}`} />
                  <span className="text-xs">Institution</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('aicte')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedRole === 'aicte'
                      ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Shield className={`w-5 h-5 ${selectedRole === 'aicte' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-xs">AICTE HQ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('student')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedRole === 'student'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 ${selectedRole === 'student' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-xs">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('recruiter')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedRole === 'recruiter'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <FileCheck2 className={`w-5 h-5 ${selectedRole === 'recruiter' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className="text-xs">Recruiter</span>
                </button>
              </div>

              {/* Student Variant Sub-Picker */}
              {selectedRole === 'student' && (
                <div className="mb-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <p className="text-xs font-bold text-emerald-900 mb-2">Select Student Demo Persona:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentVariant('clean')}
                      className={`p-2 rounded-lg text-xs text-left border transition-all ${
                        selectedStudentVariant === 'clean'
                          ? 'bg-white border-emerald-500 font-bold text-emerald-900 shadow-xs'
                          : 'bg-white/50 border-emerald-200 text-slate-700'
                      }`}
                    >
                      <p className="font-bold">Rohit Sharma</p>
                      <span className="text-[10px] text-emerald-600 font-medium">Clean Record (Verified)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStudentVariant('flagged')}
                      className={`p-2 rounded-lg text-xs text-left border transition-all ${
                        selectedStudentVariant === 'flagged'
                          ? 'bg-white border-amber-500 font-bold text-amber-900 shadow-xs'
                          : 'bg-white/50 border-emerald-200 text-slate-700'
                      }`}
                    >
                      <p className="font-bold">Priya Verma</p>
                      <span className="text-[10px] text-amber-600 font-medium">Flagged (DOB Mismatch)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Preloaded Demo Credentials Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700 uppercase tracking-wide">
                    Preloaded Demo Credentials
                  </span>
                  <span className="bg-gov-saffron-100 text-gov-saffron-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    1-Click Ready
                  </span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">Identity: </span>
                    {getTargetUser().name} ({getTargetUser().designation || getTargetUser().department || 'User'})
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Email: </span>
                    <span className="font-mono">{getTargetUser().email}</span>
                  </p>
                  {selectedRole === 'institution' && (
                    <p>
                      <span className="font-semibold text-slate-800">AICTE Permanent ID: </span>
                      <span className="font-mono">1-332014501 (IIT Delhi)</span>
                    </p>
                  )}
                  {selectedRole === 'student' && (
                    <p>
                      <span className="font-semibold text-slate-800">APAAR ID: </span>
                      <span className="font-mono">{getTargetUser().apaarId}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Security Banner */}
              <div className="flex items-start gap-2 bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 mb-5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="font-semibold">Privacy Safeguard: </strong>
                  APAAR ID is never used as a password. Authentication relies on institutional SSO and Multi-Factor OTP checks.
                </p>
              </div>

              {/* One Click Button */}
              <button
                type="button"
                onClick={handleProceedLogin}
                className="w-full py-3 bg-gov-navy-600 hover:bg-gov-navy-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {selectedRole === 'student' ? 'Proceed to Simulated 2FA / OTP' : `Enter as ${getTargetUser().name}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Simulated Student OTP Step */
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Simulated 2-Factor Authentication
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  A synthetic OTP was dispatched to registered mobile number ending in <strong className="text-slate-800">5566</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter 6-Digit One Time Password (OTP)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => {
                      setOtpValue(e.target.value);
                      setOtpError('');
                    }}
                    placeholder="123456"
                    className="w-full px-3 py-2 border rounded-lg font-mono text-center text-lg tracking-widest border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setOtpValue('123456')}
                    className="shrink-0 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300"
                  >
                    Auto-Fill
                  </button>
                </div>
                {otpError && <p className="text-xs text-rose-600 mt-1">{otpError}</p>}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
                <p className="font-semibold flex items-center gap-1 mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demo Hint:</span>
                </p>
                <p>Click &quot;Auto-Fill&quot; or enter <strong>123456</strong> to simulate Aadhaar-linked OTP verification.</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleOtpVerify}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Verify OTP & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
