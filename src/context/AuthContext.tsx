/**
 * Auth Context and Local Persistence for dahLRealm
 * Supports Registration, Login, Logout, and Role-Based Access Control (RBAC).
 * Built-in admin account for the realm owner.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAdmin: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password?: string, clan?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'dahlrealm_users_db_v1';
const SESSION_STORAGE_KEY = 'dahlrealm_auth_session_v1';

// Seeded default accounts including the admin (owner)
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'admin-goddahl',
    username: 'goddahL',
    email: 'galaxyofgaming1@gmail.com',
    password: 'dahLR3alm',
    role: 'admin',
    avatarSeed: 'Jarl-goddahl',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    vikingClan: 'Dahlgard Founders',
  },
  {
    id: 'viking-astrid',
    username: 'Astrid_Shield',
    email: 'astrid@dahlrealm.com',
    role: 'member',
    avatarSeed: 'Astrid',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    vikingClan: 'Valkyrie Vanguard',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Initialize and load saved session
  useEffect(() => {
    try {
      // Ensure seed users exist in localStorage
      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsersRaw) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      } else {
        // Ensure the owner account always has role: 'admin', username 'goddahL', and password 'dahLR3alm'
        const users: UserAccount[] = JSON.parse(storedUsersRaw);
        let updated = false;
        const mapped = users.map((u) => {
          if (
            u.email.toLowerCase() === 'galaxyofgaming1@gmail.com' ||
            u.username.toLowerCase() === 'galaxyofgaming' ||
            u.username.toLowerCase() === 'goddahl'
          ) {
            updated = true;
            return { ...u, username: 'goddahL', password: 'dahLR3alm', role: 'admin' as UserRole };
          }
          return u;
        });

        // If goddahL is missing entirely, insert
        if (!mapped.some((u) => u.username.toLowerCase() === 'goddahl')) {
          mapped.unshift(INITIAL_USERS[0]);
          updated = true;
        }

        if (updated) {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mapped));
        }
      }

      // Check current session
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession) as UserAccount;
        if (
          parsed.email.toLowerCase() === 'galaxyofgaming1@gmail.com' ||
          parsed.username.toLowerCase() === 'galaxyofgaming' ||
          parsed.username.toLowerCase() === 'goddahl'
        ) {
          const updatedSession: UserAccount = {
            ...parsed,
            username: 'goddahL',
            password: 'dahLR3alm',
            role: 'admin',
          };
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
          setCurrentUser(updatedSession);
        } else {
          setCurrentUser(parsed);
        }
      }
    } catch (e) {
      console.error('Error restoring auth session:', e);
    }
  }, []);

  const getUsers = (): UserAccount[] => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  };

  const login = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, error: 'Please enter your username or email.' };
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId
    );

    if (!user) {
      return {
        success: false,
        error: `No account found for "${identifier}". You can click "Create Account" below!`,
      };
    }

    // Password check: for goddahL / admin account, password must strictly be "dahLR3alm"
    const isOwnerAccount =
      user.username.toLowerCase() === 'goddahl' ||
      user.email.toLowerCase() === 'galaxyofgaming1@gmail.com' ||
      user.username.toLowerCase() === 'galaxyofgaming';

    if (isOwnerAccount) {
      if (!password || password !== 'dahLR3alm') {
        return {
          success: false,
          error: 'Incorrect password for goddahL administrator account.',
        };
      }
    } else if (user.password && password && user.password !== password) {
      return {
        success: false,
        error: 'Incorrect password entered.',
      };
    }

    setCurrentUser(user);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const register = async (
    username: string,
    email: string,
    password?: string,
    clan?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanName = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 3) {
      return { success: false, error: 'Viking username must be at least 3 characters long.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const users = getUsers();

    // Check duplicate
    if (users.some((u) => u.username.toLowerCase() === cleanName.toLowerCase())) {
      return { success: false, error: 'That Viking username is already taken in the realm.' };
    }
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with that email already exists. Please log in.' };
    }

    // Role assignment: owner email or goddahL username gets admin, all other players are members
    const isOwner =
      cleanEmail === 'galaxyofgaming1@gmail.com' ||
      cleanName.toLowerCase() === 'goddahl' ||
      cleanName.toLowerCase() === 'galaxyofgaming';
    const role: UserRole = isOwner ? 'admin' : 'member';

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanName,
      email: cleanEmail,
      password: password || (isOwner ? 'dahLR3alm' : undefined),
      role,
      avatarSeed: cleanName,
      createdAt: new Date().toISOString(),
      vikingClan: clan?.trim() || 'Valheim Explorer',
    };

    const updated = [...users, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
