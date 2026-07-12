import { supabase } from "./supabase";

export async function adminSignIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function adminSignOut() {
  return supabase.auth.signOut();
}

export function observeSession(cb: (session: unknown) => void) {
  supabase.auth.getSession().then(({ data }) => cb(data.session));
  const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
    cb(session)
  );
  return () => sub.subscription.unsubscribe();
}
