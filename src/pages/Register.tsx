
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import PasswordInput from '@/components/PasswordInput';
import { toast } from 'sonner';
import { User } from 'lucide-react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('passwordsNotMatch'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(username, password, profileImage);
      
      if (success) {
        toast.success(t('accountCreated'));
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold animate-text-glow mb-2">{t('register')}</h1>
          <p className="text-muted-foreground">{t('createAccount')}</p>
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
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              {t('confirmPassword')}
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
          </div>
          
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium mb-2">
              {t('profileImage')}
            </label>
            
            <div className="flex flex-col items-center space-y-4">
              {profileImage && (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-neon-purple">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setProfileImage(undefined)}
                    className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3"
                    aria-label="Remove image"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              )}
              
              <input
                type="file"
                id="profileImage"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {profileImage ? t('changeProfileImage') : t('uploadImage')}
              </button>
            </div>
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
                <User className="mr-2 h-5 w-5" />
                {t('register')}
              </>
            )}
          </button>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {t('alreadyHaveAccount')} 
            </span>{' '}
            <Link to="/login" className="text-neon-purple hover:text-neon-blue transition-colors">
              {t('login')}
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
