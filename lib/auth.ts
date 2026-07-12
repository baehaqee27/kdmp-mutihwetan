"use client";

import * as React from "react";
import { supabase } from "./supabase";

export type AuthUser = {
  id: string;
  email: string | null;
  name: string;
  phone: string;
};

function mapUser(session: { user?: any } | null): AuthUser | null {
  if (!session?.user) return null;
  const u = session.user;
  return {
    id: u.id,
    email: u.email ?? null,
    name: u.user_metadata?.name ?? "",
    phone: u.user_metadata?.phone ?? "",
  };
}

export function useAuth() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(mapUser(data.session));
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(mapUser(session));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export async function signUp(input: {
  name: string;
  phone: string;
  email: string;
  password: string;
}) {
  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { name: input.name, phone: input.phone } },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}
