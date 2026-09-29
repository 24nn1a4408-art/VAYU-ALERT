import React, { useState } from 'react';
import { AlertTriangle, Eye, EyeOff, LockKeyhole, Mail, User, Wind, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';
import { DEMO_CREDENTIALS, login, resetPassword, signup, AuthUser } from '../auth/auth';

type Mode = 'landing' | 'login' | 'signup' | 'forgot';

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<Mode>('landing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const clearFeedback = () => { setError(''); setMessage(''); };
  const switchMode = (next: Mode) => { clearFeedback(); setMode(next); };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    try {
      onAuthenticated(login(email, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!name.trim()) return setError('Please enter your full name.');
    if (password.length < 6) return setError('Password must contain at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    try {
      onAuthenticated(signup(name, email, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account creation failed.');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (password.length < 6) return setError('New password must contain at least 6 characters.');
    try {
      resetPassword(email, password);
      setMessage('Password reset successfully. You can now log in.');
      setPassword('');
      setMode('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password.');
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setMode('login');
    clearFeedback();
  };

  if (mode === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EBE1D1] via-[#E4DCCF] to-[#DDD2BF] text-[#0D4715] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
          <div className="p-4 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-[#0D4715] flex items-center justify-center text-amber-300 shadow-lg">
                <Wind className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">VAYU ALERT</h1>
                <p className="text-xs font-semibold text-[#41644A]">Cyclone Early Warning & Ocean Surveillance</p>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-5">Know the storm.<br />Protect what matters.</h2>
            <p className="max-w-xl text-slate-700 leading-relaxed mb-7">An intelligent cyclone monitoring and disaster management platform for early awareness, risk assessment, live ocean surveillance and emergency response.</p>
            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              {['Cyclone Monitoring', 'Risk Assessment', 'Emergency Alerts'].map((item) => (
                <div key={item} className="glass-panel rounded-2xl p-4 text-xs font-bold">{item}</div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => switchMode('login')} className="px-6 py-3 rounded-xl bg-[#0D4715] text-white font-bold shadow-lg hover:bg-[#41644A] transition">Login</button>
              <button onClick={() => switchMode('signup')} className="px-6 py-3 rounded-xl bg-white/70 border border-white text-[#0D4715] font-bold hover:bg-white transition">Create Account</button>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="h-6 w-6 text-[#0D4715]" />
              <div><h3 className="font-extrabold">Secure access to VAYU ALERT</h3><p className="text-xs text-slate-500">Sign in to access your monitoring dashboard</p></div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-2xl bg-white/60 border border-white"><b>Citizen Portal</b><p className="text-xs text-slate-500 mt-1">Cyclone alerts, locations, live sea map and safety information.</p></div>
              <div className="p-4 rounded-2xl bg-white/60 border border-white"><b>Disaster Management Portal</b><p className="text-xs text-slate-500 mt-1">Operational cyclone intelligence, classification and tactical views.</p></div>
              <div className="p-4 rounded-2xl bg-white/60 border border-white"><b>Personal Profile</b><p className="text-xs text-slate-500 mt-1">Manage your monitored location and emergency contacts.</p></div>
            </div>
            <button onClick={fillDemo} className="mt-5 w-full py-3 rounded-xl border border-[#41644A]/30 bg-[#EBE1D1]/70 text-[#0D4715] font-bold text-sm hover:bg-white transition">Use Demo Login</button>
            <p className="text-[10px] text-slate-500 mt-3 text-center">Demo: admin@vayualert.com / Vayu@123</p>
          </div>
        </div>
      </div>
    );
  }

  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';
  const title = isSignup ? 'Create your VAYU ALERT account' : isForgot ? 'Reset your password' : 'Welcome back';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBE1D1] via-[#E4DCCF] to-[#DDD2BF] flex items-center justify-center p-4 text-[#0D4715]">
      <div className="w-full max-w-md">
        <button onClick={() => switchMode('landing')} className="flex items-center gap-2 text-xs font-bold text-[#41644A] mb-4 hover:text-[#0D4715]"><ArrowLeft className="h-4 w-4" /> Back to VAYU ALERT</button>
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-[#0D4715] flex items-center justify-center text-amber-300"><Wind className="h-6 w-6" /></div>
            <div><div className="font-black text-xl">VAYU ALERT</div><div className="text-[11px] text-[#41644A] font-semibold">Secure account access</div></div>
          </div>
          <h2 className="text-2xl font-black mb-1">{title}</h2>
          <p className="text-xs text-slate-500 mb-6">{isSignup ? 'Create an account to save your cyclone monitoring preferences.' : isForgot ? 'Enter your account email and choose a new password.' : 'Sign in to continue to your disaster monitoring dashboard.'}</p>

          {error && <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}
          {message && <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">{message}</div>}

          <form onSubmit={isSignup ? handleSignup : isForgot ? handleReset : handleLogin} className="space-y-4">
            {isSignup && <div><label className="label-auth">Full Name</label><div className="input-wrap"><User /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" autoComplete="name" /></div></div>}
            <div><label className="label-auth">Email</label><div className="input-wrap"><Mail /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" required /></div></div>
            <div><label className="label-auth">{isForgot ? 'New Password' : 'Password'}</label><div className="input-wrap"><LockKeyhole /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={isSignup ? 'new-password' : 'current-password'} required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></div>
            {isSignup && <div><label className="label-auth">Confirm Password</label><div className="input-wrap"><KeyRound /><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" autoComplete="new-password" required /></div></div>}
            <button type="submit" className="w-full py-3 rounded-xl bg-[#0D4715] hover:bg-[#41644A] text-white font-bold shadow-md transition">{isSignup ? 'Create Account' : isForgot ? 'Reset Password' : 'Login'}</button>
          </form>

          {!isSignup && !isForgot && <div className="mt-4 text-center"><button onClick={() => switchMode('forgot')} className="text-xs font-bold text-[#41644A] hover:underline">Forgot Password?</button></div>}
          {isForgot && <div className="mt-4 text-center"><button onClick={() => switchMode('login')} className="text-xs font-bold text-[#41644A] hover:underline">Back to Login</button></div>}
          {isSignup ? <p className="mt-6 text-center text-xs text-slate-500">Already have an account? <button onClick={() => switchMode('login')} className="font-bold text-[#0D4715]">Login</button></p> : !isForgot && <p className="mt-6 text-center text-xs text-slate-500">Don't have an account? <button onClick={() => switchMode('signup')} className="font-bold text-[#0D4715]">Sign Up</button></p>}
        </div>
      </div>
    </div>
  );
};
