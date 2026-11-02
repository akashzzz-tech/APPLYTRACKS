'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from './supabase/client';
import { Profile } from '@/types';
import { DataService } from './data-service';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'applytrack_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      try {
        const supabase = createClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const u: User = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || '',
            };
            setUser(u);
            const p = await DataService.getProfile(u.id, u.email);
            setProfile(p);
          } else {
            setUser(null);
            setProfile(null);
          }

          // Listen to changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (newSession?.user) {
              const u: User = {
                id: newSession.user.id,
                email: newSession.user.email || '',
                full_name: newSession.user.user_metadata?.full_name || '',
              };
              setUser(u);
              const p = await DataService.getProfile(u.id, u.email);
              setProfile(p);
            } else {
              setUser(null);
              setProfile(null);
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Local demo session check
          const savedUser = localStorage.getItem(LOCAL_USER_KEY);
          if (savedUser) {
            const u = JSON.parse(savedUser) as User;
            setUser(u);
            const p = await DataService.getProfile(u.id, u.email);
            setProfile(p);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        if (data.user) {
          const u: User = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || '',
          };
          setUser(u);
          const p = await DataService.getProfile(u.id, u.email);
          setProfile(p);
        }
        setIsLoading(false);
        return {};
      }

      // Local / Offline demo authentication
      // Validate simple inputs
      if (!email.includes('@') || password.length < 6) {
        setIsLoading(false);
        return { error: 'Invalid email or password (minimum 6 characters).' };
      }

      const dummyId = 'usr_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
      const u: User = {
        id: dummyId,
        email: email.toLowerCase(),
        full_name: email.split('@')[0].toUpperCase(),
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      setUser(u);
      const p = await DataService.getProfile(u.id, u.email);
      setProfile(p);
      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'An unexpected error occurred.' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        if (data.user) {
          const u: User = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
          };
          setUser(u);
          const p = await DataService.getProfile(u.id, u.email);
          setProfile(p);
        }
        setIsLoading(false);
        return {};
      }

      // Local demo sign up
      if (!email.includes('@') || password.length < 6) {
        setIsLoading(false);
        return { error: 'Please enter a valid email and minimum 6 characters password.' };
      }

      const dummyId = 'usr_' + btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
      const u: User = {
        id: dummyId,
        email: email.toLowerCase(),
        full_name: fullName || email.split('@')[0],
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      setUser(u);
      const p = await DataService.getProfile(u.id, u.email);
      p.full_name = fullName;
      await DataService.updateProfile(u.id, { full_name: fullName });
      setProfile(p);
      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Sign up failed.' };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { error: error.message };
      return {};
    }
    // Local demo
    return {};
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
    if (!user) return null;
    const updated = await DataService.updateProfile(user.id, updates);
    setProfile(updated);
    return updated;
  };

  const refreshProfile = async () => {
    if (!user) return;
    const p = await DataService.getProfile(user.id, user.email);
    setProfile(p);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
