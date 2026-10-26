import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, AlertCircle, Loader2, Video, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await api.login(email, password);
        onAuthSuccess();
      } else {
        await api.register(email, password);
        setRegistered(true);
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-[#00111c] px-4 py-16 text-white">
      {/* Top Header Bar with Back Button */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#002e4e] bg-[#001a2c]/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-300 transition-all hover:bg-[#00253e] hover:text-white hover:border-[#00406c]"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#38bdf8]" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 h-64 sm:h-80 w-64 sm:w-80 rounded-full bg-[#00406c]/20 blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-64 sm:h-80 w-64 sm:w-80 rounded-full bg-[#002e4e]/30 blur-[100px] sm:blur-[120px] pointer-events-none" />

      {/* Brand logo header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 sm:mb-8 flex flex-col items-center text-center mt-6 sm:mt-0"
      >
        <div className="mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#00406c] border border-[#005a96] shadow-lg shadow-[#00406c]/30">
          <Video className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <h1 className="bg-gradient-to-r from-white via-sky-200 to-[#38bdf8] bg-clip-text text-3xl sm:text-4xl font-black tracking-tight text-transparent font-outfit">
          AnimoConcepto
        </h1>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-400 max-w-xs">
          Generate stunning mathematical and explanatory animations with AI.
        </p>
      </motion.div>

      {/* Main glassmorphic card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md rounded-2xl border border-[#002e4e] bg-[#001a2c] p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Toggle tabs */}
        <div className="mb-6 flex rounded-lg bg-[#00111c] p-1 border border-[#002e4e]">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
              setRegistered(false);
            }}
            className={`flex-1 rounded-md py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              isLogin
                ? 'bg-[#00406c] text-white shadow-md border border-[#005a96]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
              setRegistered(false);
            }}
            className={`flex-1 rounded-md py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              !isLogin
                ? 'bg-[#00406c] text-white shadow-md border border-[#005a96]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {registered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 sm:p-3.5 text-xs text-emerald-400"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Registration successful! Please sign in with your credentials.</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 sm:p-3.5 text-xs text-rose-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 h-4 sm:h-5 w-4 sm:w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#002e4e] bg-[#00111c] py-2.5 pr-4 pl-10 sm:pl-11 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-[#00406c] focus:ring-1 focus:ring-[#00406c]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 sm:h-5 w-4 sm:w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#002e4e] bg-[#00111c] py-2.5 pr-4 pl-10 sm:pl-11 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-[#00406c] focus:ring-1 focus:ring-[#00406c]"
              />
            </div>
          </div>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 sm:h-5 w-4 sm:w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#002e4e] bg-[#00111c] py-2.5 pr-4 pl-10 sm:pl-11 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-[#00406c] focus:ring-1 focus:ring-[#00406c]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00406c] border border-[#005a96] py-3 text-xs sm:text-sm font-bold shadow-lg shadow-[#00406c]/30 transition-all duration-300 hover:bg-[#005a96] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
