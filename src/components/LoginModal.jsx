import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginModal({ isOpen, onClose }) {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error: authError } = isLogin 
      ? await login(email, password) 
      : await signup(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      setSuccessMessage(isLogin ? "Successfully logged in!" : "Welcome to the Community!");
      setLoading(false);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-bcc-card border border-white/10 rounded-2xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {successMessage ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Success!</h2>
              <p className="text-gray-300 text-lg">{successMessage}</p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Join the Community'}
                </h2>
                <p className="text-bcc-muted text-sm">
                  {isLogin ? 'Sign in to access your tickets and RSVP to events.' : 'Create an account to track your events and connect.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-bcc-yellow transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-bcc-yellow transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-bcc-yellow text-bcc-dark font-bold py-3 rounded-xl mt-6 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => { setIsLogin(!isLogin); setError(null); }}
                    className="text-bcc-yellow hover:underline font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
