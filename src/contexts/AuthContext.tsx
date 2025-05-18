
import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateUniqueCode } from '@/lib/utils';

interface User {
  username: string;
  password: string;
  profileImage?: string;
  recoveryCode: string;
  colorHue: number;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, profileImage?: string) => boolean;
  logout: () => void;
  updateUsername: (newUsername: string) => boolean;
  updatePassword: (newPassword: string) => void;
  updateProfileImage: (newProfileImage: string | undefined) => void;
  verifyRecoveryCode: (username: string, code: string) => boolean;
  resetPassword: (username: string, code: string, newPassword: string) => boolean;
  getRecoveryCode: () => string;
  saveChanges: () => void;
  hasUnsavedChanges: boolean;
  deleteAccount: (username: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add console commands
const setupConsoleCommands = (
  loginFn: (username: string, password: string) => boolean,
  deleteFn: (username: string) => boolean
) => {
  // @ts-ignore - Adding global functions
  window.deleteUser = (username: string) => {
    if (username === 'all') {
      localStorage.removeItem('users');
      console.log('All users have been deleted');
      return true;
    } else {
      const success = deleteFn(username);
      if (success) {
        console.log(`User ${username} has been deleted`);
      } else {
        console.log(`User ${username} not found`);
      }
      return success;
    }
  };

  // @ts-ignore - Adding global functions
  window.listUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const usernames = users.map((user: User) => user.username);
    console.log('Registered users:', usernames);
    return usernames;
  };

  // @ts-ignore - Adding global functions
  window.loginUser = (username: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username);
    
    if (user) {
      const success = loginFn(username, user.password);
      if (success) {
        console.log(`Logged in as ${username}`);
        window.location.href = '/'; // Redirect to index
      }
      return success;
    } else {
      console.log(`User ${username} not found`);
      return false;
    }
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setOriginalUser(parsedUser);
      setIsAuthenticated(true);
    }
    setInitialized(true);
  }, []);

  const saveChanges = () => {
    if (!currentUser) return;
    
    const users = getUsers();
    const updatedUsers = users.map(user => 
      user.username === originalUser?.username ? currentUser : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    setOriginalUser(currentUser);
  };

  const getUsers = (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const login = (username: string, password: string): boolean => {
    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
      setCurrentUser(user);
      setOriginalUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const register = (username: string, password: string, profileImage?: string): boolean => {
    const users = getUsers();
    
    if (users.some(user => user.username === username)) {
      return false;
    }
    
    const newUser: User = {
      username,
      password,
      profileImage,
      recoveryCode: generateUniqueCode(),
      colorHue: Math.floor(Math.random() * 360)
    };
    
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setCurrentUser(newUser);
    setOriginalUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setOriginalUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const deleteAccount = (username: string): boolean => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
      return false;
    }
    
    const updatedUsers = [...users];
    updatedUsers.splice(userIndex, 1);
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // If we're deleting the current user, log out
    if (currentUser?.username === username) {
      logout();
    }
    
    return true;
  };

  const updateUsername = (newUsername: string): boolean => {
    if (!currentUser) return false;
    
    const users = getUsers();
    if (newUsername !== currentUser.username && users.some(user => user.username === newUsername)) {
      return false;
    }
    
    setCurrentUser(prev => prev ? { ...prev, username: newUsername } : null);
    return true;
  };

  const updatePassword = (newPassword: string) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null);
  };

  const updateProfileImage = (newProfileImage: string | undefined) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, profileImage: newProfileImage } : null);
  };

  const verifyRecoveryCode = (username: string, code: string): boolean => {
    const users = getUsers();
    return users.some(user => user.username === username && user.recoveryCode === code);
  };

  const resetPassword = (username: string, code: string, newPassword: string): boolean => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.username === username && user.recoveryCode === code);
    
    if (userIndex === -1) {
      return false;
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    return true;
  };

  const getRecoveryCode = (): string => {
    return currentUser?.recoveryCode || '';
  };

  const hasUnsavedChanges = (): boolean => {
    if (!currentUser || !originalUser) return false;
    
    return (
      currentUser.username !== originalUser.username ||
      currentUser.password !== originalUser.password ||
      currentUser.profileImage !== originalUser.profileImage
    );
  };

  // Initialize console commands
  useEffect(() => {
    setupConsoleCommands(login, deleteAccount);
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
