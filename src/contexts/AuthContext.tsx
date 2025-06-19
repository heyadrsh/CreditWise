import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        localStorage.setItem('admin_access', 'true');
        localStorage.setItem('admin_user_id', user.id);
        localStorage.setItem('admin_email', user.email || '');
      } else {
        localStorage.removeItem('admin_access');
        localStorage.removeItem('admin_user_id');
        localStorage.removeItem('admin_email');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('admin_access');
      localStorage.removeItem('admin_user_id');
      localStorage.removeItem('admin_email');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        if (session?.user) {
          localStorage.setItem('admin_access', 'true');
          localStorage.setItem('admin_user_id', session.user.id);
          localStorage.setItem('admin_email', session.user.email || '');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('admin_access');
        localStorage.removeItem('admin_user_id');
        localStorage.removeItem('admin_email');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = user !== null || localStorage.getItem('admin_access') === 'true';

  const value = {
    user,
    isAdmin,
    isLoading,
    signOut,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 