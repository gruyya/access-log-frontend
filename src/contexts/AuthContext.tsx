"use client";
import React, { createContext, PropsWithChildren, useContext } from "react";

import { useStorageState } from "@/hooks/useStorageState";
import { redirect } from "next/navigation";

export type TokenResource = {
  name: string;
  token: string;
};

const AuthContext = createContext<{
  signIn: (session: TokenResource) => void;
  signOut: () => void;
  token?: string;
  isLoading: boolean;
}>({
  signIn: (session: TokenResource) => null,
  signOut: () => null,
  isLoading: false,
});

export function useAuth() {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function AuthProvider(props: PropsWithChildren) {
  const [[isLoading, session], setSession] =
    useStorageState<TokenResource>("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: async (session: TokenResource) => {
          setSession(session);

          redirect("/access-log");
        },
        signOut: () => {
          setSession(null);
          redirect("/");
        },
        token: session?.token,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
