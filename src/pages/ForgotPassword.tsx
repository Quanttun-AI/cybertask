
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import PasswordInput from '@/components/PasswordInput';
import { toast } from 'sonner';

type Step = 'username' | 'code' | 'reset';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>('username');
  const [username, setUsername] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyRecoveryCode, resetPassword } = useAuth();
  const { t } = useLanguage();

  const handleSubmitUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setStep('code');
    }
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (verifyRecoveryCode(username, recoveryCode)) {
      setStep('reset');
      setIsSubmitting(false);
    } else {
      toast.error(t('invalidRecoveryCode'));
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('passwordsNotMatch'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = resetPassword(username, recoveryCode, password);
      
      if (success) {
        toast.success(t('passwordReset'));
        // Redirect to login after successful password reset
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(t('error'));
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold animate-text-glow mb-2">{t('recoverAccount')}</h1>
          <p className="text-muted-foreground">{t('forgotPassword')}</p>
        </div>
        
        <div className="neon-border p-6 rounded-lg bg-black/40 backdrop-blur-xl animate-fade-in">
          {step === 'username' && (
            <form onSubmit={handleSubmitUsername} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  {t('username')}
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('username')}
                  required
                  className="w-full p-3 rounded-md bg-secondary/20 border-none outline-none focus:ring-1 focus:ring-neon-purple transition-all duration-200"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-neon-purple/20 hover:bg-neon-purple/30 transition-all duration-300"
              >
                {t('continue')}
              </button>
              
              <div className="text-center text-sm">
                <Link to="/login" className="text-neon-purple hover:text-neon-blue transition-colors">
                  {t('backToLogin')}
                </Link>
              </div>
            </form>
          )}
          
          {step === 'code' && (
            <form onSubmit={handleSubmitCode} className="space-y-6">
              <div>
                <label htmlFor="recoveryCode" className="block text-sm font-medium mb-2">
                  {t('enterRecoveryCode')}
                </label>
                <input
                  type="text"
                  id="recoveryCode"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder={t('enterRecoveryCode')}
                  required
                  className="w-full p-3 rounded-md bg-secondary/20 border-none outline-none focus:ring-1 focus:ring-neon-purple transition-all duration-200"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-md transition-all duration-300 ${
                  isSubmitting ? 'bg-secondary' : 'bg-neon-purple/20 hover:bg-neon-purple/30'
                }`}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 mx-auto border-2 border-t-transparent border-neon-purple rounded-full animate-spin"/>
                ) : (
                  t('verify')
                )}
              </button>
              
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setStep('username')}
                  className="text-neon-purple hover:text-neon-blue transition-colors"
                >
                  {t('back')}
                </button>
              </div>
            </form>
          )}
          
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  {t('enterNewPassword')}
                </label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={setPassword}
                  placeholder={t('enterNewPassword')}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  {t('confirmNewPassword')}
                </label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder={t('confirmNewPassword')}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-md transition-all duration-300 ${
                  isSubmitting ? 'bg-secondary' : 'bg-neon-purple/20 hover:bg-neon-purple/30'
                }`}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 mx-auto border-2 border-t-transparent border-neon-purple rounded-full animate-spin"/>
                ) : (
                  t('resetPassword')
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
