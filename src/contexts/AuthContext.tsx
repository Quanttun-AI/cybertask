
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { generateUniqueCode } from '@/lib/utils';
import { supabase, UserProfile } from '@/lib/supabase';
import { toast } from 'sonner';

interface User {
  username: string;
  profileImage?: string;
  recoveryCode: string;
  colorHue: number;
  id: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, profileImage?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfileImage: (newProfileImage: string | undefined) => Promise<void>;
  verifyRecoveryCode: (username: string, code: string) => Promise<boolean>;
  resetPassword: (username: string, code: string, newPassword: string) => Promise<boolean>;
  getRecoveryCode: () => string;
  saveChanges: () => Promise<void>;
  hasUnsavedChanges: boolean;
  deleteAccount: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseClient = useSupabaseClient();
  const supabaseUser = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Carregar perfil do usuário atual
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (supabaseUser) {
        const { data, error } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (data) {
          const user: User = {
            id: data.id,
            username: data.username,
            profileImage: data.profile_image,
            recoveryCode: data.recovery_code,
            colorHue: data.color_hue
          };
          setCurrentUser(user);
          setOriginalUser(user);
          setIsAuthenticated(true);
        } else {
          console.error('Erro ao carregar perfil:', error);
        }
      } else {
        setCurrentUser(null);
        setOriginalUser(null);
        setIsAuthenticated(false);
      }
      setInitialized(true);
    };

    fetchUserProfile();
  }, [supabaseUser]);

  const saveChanges = async () => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabaseClient
        .from('user_profiles')
        .update({
          username: currentUser.username,
          profile_image: currentUser.profileImage
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      setOriginalUser(currentUser);
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast.error('Erro ao salvar alterações');
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Primeiro, buscamos o email associado ao nome de usuário
      const { data: profileData } = await supabaseClient
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profileData) {
        return false;
      }

      // Agora fazemos o login com o email e senha
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: `${username}@example.com`, // Usamos o username como parte do email
        password
      });

      if (error || !data.user) {
        console.error('Erro de login:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro de login:', error);
      return false;
    }
  };

  const register = async (username: string, password: string, profileImage?: string): Promise<boolean> => {
    try {
      // Verificar se o usuário já existe
      const { data: existingUser } = await supabaseClient
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        return false;
      }

      // Criar a conta com email (username@example.com) e senha
      const { data, error } = await supabaseClient.auth.signUp({
        email: `${username}@example.com`,
        password
      });

      if (error || !data.user) {
        console.error('Erro ao registrar:', error);
        return false;
      }

      // Criar o perfil do usuário
      const recoveryCode = generateUniqueCode();
      const colorHue = Math.floor(Math.random() * 360);
      
      const { error: profileError } = await supabaseClient
        .from('user_profiles')
        .insert({
          id: data.user.id,
          username,
          profile_image: profileImage,
          recovery_code: recoveryCode,
          color_hue: colorHue
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    setCurrentUser(null);
    setOriginalUser(null);
    setIsAuthenticated(false);
  };

  const deleteAccount = async (username: string): Promise<boolean> => {
    try {
      // Verificar se o usuário existe
      const { data: userData } = await supabaseClient
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!userData) {
        return false;
      }

      // Deletar os todos do usuário
      await supabaseClient
        .from('todos')
        .delete()
        .eq('user_id', userData.id);

      // Deletar o perfil do usuário
      await supabaseClient
        .from('user_profiles')
        .delete()
        .eq('id', userData.id);

      // Se o usuário atual for o que está sendo deletado, faça logout
      if (currentUser?.username === username) {
        await logout();
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      return false;
    }
  };

  const updateUsername = async (newUsername: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      // Verificar se o nome de usuário já existe
      const { data } = await supabaseClient
        .from('user_profiles')
        .select('id')
        .eq('username', newUsername)
        .neq('id', currentUser.id)
        .single();

      if (data) {
        return false;
      }
      
      setCurrentUser(prev => prev ? { ...prev, username: newUsername } : null);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar nome de usuário:', error);
      return false;
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      toast.success('Senha atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      toast.error('Erro ao atualizar senha');
    }
  };

  const updateProfileImage = async (newProfileImage: string | undefined) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, profileImage: newProfileImage } : null);
  };

  const verifyRecoveryCode = async (username: string, code: string): Promise<boolean> => {
    try {
      const { data } = await supabaseClient
        .from('user_profiles')
        .select('recovery_code')
        .eq('username', username)
        .single();

      return data && data.recovery_code === code;
    } catch (error) {
      console.error('Erro ao verificar código de recuperação:', error);
      return false;
    }
  };

  const resetPassword = async (username: string, code: string, newPassword: string): Promise<boolean> => {
    try {
      const { data } = await supabaseClient
        .from('user_profiles')
        .select('id, recovery_code')
        .eq('username', username)
        .single();

      if (!data || data.recovery_code !== code) {
        return false;
      }

      // Resetar a senha exigiria ter acesso ao email do usuário
      // Como estamos usando um formato de email fictício, precisaríamos implementar
      // um fluxo personalizado para redefinir a senha
      toast.error('Funcionalidade não disponível no momento');
      return false;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return false;
    }
  };

  const getRecoveryCode = (): string => {
    return currentUser?.recoveryCode || '';
  };

  const hasUnsavedChanges = (): boolean => {
    if (!currentUser || !originalUser) return false;
    
    return (
      currentUser.username !== originalUser.username ||
      currentUser.profileImage !== originalUser.profileImage
    );
  };

  // Setup console commands para debugging
  useEffect(() => {
    // @ts-ignore - Adding global functions
    window.listUsers = async () => {
      const { data } = await supabaseClient.from('user_profiles').select('username');
      console.log('Usuários registrados:', data?.map(user => user.username));
      return data?.map(user => user.username);
    };

    // @ts-ignore - Adding global functions
    window.deleteUser = async (username: string) => {
      if (username === 'all') {
        // Não implementamos a exclusão em massa por segurança
        console.log('Exclusão em massa não permitida no Supabase');
        return false;
      } else {
        const success = await deleteAccount(username);
        if (success) {
          console.log(`Usuário ${username} foi excluído`);
        } else {
          console.log(`Usuário ${username} não encontrado`);
        }
        return success;
      }
    };

    // @ts-ignore - Adding global functions
    window.loginUser = async (username: string) => {
      const { data } = await supabaseClient
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .single();
        
      if (!data) {
        console.log(`Usuário ${username} não encontrado`);
        return false;
      }
      
      console.log(`Login como ${username} não é possível via console no Supabase`);
      return false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      register,
      logout,
      updateUsername,
      updatePassword,
      updateProfileImage,
      verifyRecoveryCode,
      resetPassword,
      getRecoveryCode,
      saveChanges,
      hasUnsavedChanges: hasUnsavedChanges(),
      deleteAccount
    }}>
      {initialized && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
