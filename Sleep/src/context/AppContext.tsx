import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { loadAppData, saveAppData } from "../utils/storage";

export type User = {
  id: number;
  email: string;
  displayName: string;
  avatarUri?: string | null;
};

export type Booking = {
  id: number;
  userId: number;
  listingId: number;
  startDate: string; 
  endDate: string;   
  guests: number;
  totalPrice: number;
  status: "active" | "cancelled";
  createdAt: number;
};

type AppState = {
  user: User | null;
  token: string | null;
};

type AppContextType = {
  state: AppState;

  // Profile
  setDisplayName: (name: string) => void;
  setAvatarUri: (uri: string | null) => void;

  // Auth
  login: (payload: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    token: null,
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedData = await loadAppData(); 
        const savedToken = await SecureStore.getItemAsync("auth_token");

        setState((prev) => ({
          ...prev,
          user: savedData?.user ?? null,
          token: savedToken ?? null,
        }));
      } catch (error) {
        console.error("Error loading app data:", error);
      }
    };

    initApp();
  }, []);


  useEffect(() => {
    saveAppData({
      user: state.user,
    });
  }, [state.user]);

  /** ========== Actions ========== */
  const setDisplayName = (name: string) => {
    setState((s) => ({
      ...s,
      user: s.user ? { ...s.user, displayName: name } : s.user,
    }));
  };

  const setAvatarUri = (uri: string | null) => {
    setState((s) => ({
      ...s,
      user: s.user ? { ...s.user, avatarUri: uri } : s.user,
    }));
  };

  const login = async (payload: { token: string; user: User }) => {
    await SecureStore.setItemAsync("auth_token", payload.token);
    setState((s) => ({
      ...s,
      token: payload.token,
      user: payload.user,
    }));
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("auth_token");
    setState(() => ({
      user: null,
      token: null,
    }));
  };

  const value = useMemo(
    () => ({
      state,
      setDisplayName,
      setAvatarUri,
      login,
      logout,
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
