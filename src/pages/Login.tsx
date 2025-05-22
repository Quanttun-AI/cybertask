
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import PasswordInput from '@/components/PasswordInput';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success(`${t('welcomeBack')}, ${username}!`);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold animate-text-glow mb-2">{t('login')}</h1>
          <p className="text-muted-foreground">{t('welcomeBack')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 neon-border p-6 rounded-lg bg-black/40 backdrop-blur-xl animate-fade-in">
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
              autoComplete="username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t('password')}
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              required
            />
          </div>
          
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-neon-purple hover:text-neon-blue transition-colors">
              {t('forgotPassword')}
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-md flex items-center justify-center transition-all duration-300 ${
              isSubmitting ? 'bg-secondary' : 'bg-neon-purple/20 hover:bg-neon-purple/30'
            }`}
          >
            {isSubmitting ? (
              <div className="h-5 w-5 border-2 border-t-transparent border-neon-purple rounded-full animate-spin"/>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                {t('login')}
              </>
            )}
          </button>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {t('dontHaveAccount')} 
            </span>{' '}
            <Link to="/register" className="text-neon-purple hover:text-neon-blue transition-colors">
              {t('register')}
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
