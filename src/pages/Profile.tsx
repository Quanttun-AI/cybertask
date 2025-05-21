
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import PasswordInput from '@/components/PasswordInput';
import { toast } from 'sonner';
import { Eye, EyeOff, LogOut, Save, User, ArrowLeft, Trash2 } from 'lucide-react';
import { getInitials, getContrastColor } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
  const { currentUser, updateUsername, updatePassword, updateProfileImage, saveChanges, hasUnsavedChanges, getRecoveryCode, logout, deleteAccount } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [showRecoveryCode, setShowRecoveryCode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setProfileImage(currentUser.profileImage);
      setRecoveryCode(getRecoveryCode());
    }
  }, [currentUser, getRecoveryCode]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfileImage(result);
        updateProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(undefined);
    updateProfileImage(undefined);
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm(t('confirmUnsavedChanges'))) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (username !== currentUser?.username) {
        const success = updateUsername(username);
        if (!success) {
          toast.error(t('usernameExists'));
          setIsLoading(false);
          return;
        }
      }
      
      if (password) {
        updatePassword(password);
      }
      
      saveChanges();
      toast.success(t('changesSaved'));
      setPassword('');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success(t('logout'));
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = () => {
    if (!currentUser) return;

    // Corrigimos aqui o problema - não comparamos com currentUser.password
    // Apenas passamos o confirmPassword para verificação
    if (!confirmPassword) {
      toast.error(t('passwordRequired'));
      return;
    }

    deleteAccount(currentUser.username)
      .then(success => {
        if (success) {
          toast.success(t('accountDeleted'));
          navigate('/login');
        } else {
          toast.error(t('error'));
        }
        setShowDeleteDialog(false);
        setConfirmPassword('');
      })
      .catch(error => {
        console.error('Error deleting account:', error);
        toast.error(t('error'));
        setShowDeleteDialog(false);
      });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleGoBack} 
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('back')}
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold animate-text-glow mb-2">{t('profile')}</h1>
          <p className="text-muted-foreground">{t('editProfile')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 neon-border p-6 rounded-lg bg-black/40 backdrop-blur-xl animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            {profileImage ? (
              <div className="relative w-24 h-24">
                <img 
                  src={profileImage} 
                  alt={username} 
                  className="w-full h-full rounded-full object-cover border-2 border-neon-purple"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute bottom-0 right-0 bg-destructive text-white rounded-full p-1 shadow-lg"
                  aria-label={t('removeProfileImage')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: getContrastColor(currentUser.colorHue) }}
              >
                <span className="text-3xl font-bold text-gray-800">{getInitials(username)}</span>
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
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              {t('changeUsername')}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full p-3 rounded-md bg-secondary/20 border-none outline-none focus:ring-1 focus:ring-neon-purple transition-all duration-200"
              autoComplete="username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t('changePassword')}
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder={t('newPassword')}
            />
          </div>
          
          <div>
            <label htmlFor="recoveryCode" className="block text-sm font-medium mb-2">
              {t('recoveryCode')}
            </label>
            <div className="relative">
              <input
                type={showRecoveryCode ? 'text' : 'password'}
                id="recoveryCode"
                value={recoveryCode}
                readOnly
                className="w-full p-3 rounded-md bg-secondary/20 border-none outline-none text-center"
              />
              <button
                type="button"
                onClick={() => setShowRecoveryCode(!showRecoveryCode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showRecoveryCode ? t('hide') : t('show')}
              >
                {showRecoveryCode ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('recoveryCodeInfo')}
            </p>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row pt-4 gap-2 sm:justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center justify-center"
              >
                <LogOut className="mr-2 h-5 w-5" />
                {t('logout')}
              </Button>
              
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAccount}
                className="flex items-center justify-center"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                {t('deleteAccount')}
              </Button>
            </div>
            
            {hasUnsavedChanges && (
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-neon-purple/20 hover:bg-neon-purple/30 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-t-transparent border-neon-purple rounded-full animate-spin"/>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    {t('saveChanges')}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteAccount')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteAccountConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
              {t('confirmPassword')}
            </label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('deleteAccount')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Profile;
