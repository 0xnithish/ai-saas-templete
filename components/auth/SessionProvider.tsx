"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface SessionContextType {
  session: any | null;
  isLoading: boolean;
  error: Error | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession?: any | null;
}

export function SessionProvider({ children, initialSession }: AuthProviderProps) {
  const [session, setSession] = useState<any | null>(initialSession || null);
  const [isLoading, setIsLoading] = useState(!initialSession);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip if we already have a session from SSR
    if (initialSession) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    
    const fetchSession = async () => {
      try {
        const { data: currentSession } = await authClient.getSession();
        if (mounted) {
          setSession(currentSession);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      mounted = false;
    };
  }, [initialSession]);

  return (
    <SessionContext.Provider value={{ session, isLoading, error }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionOptimized() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionOptimized must be used within a SessionProvider");
  }
  return context;
}
