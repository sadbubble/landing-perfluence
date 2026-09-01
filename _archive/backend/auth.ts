import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type Profile = {
  id: string;
  role: "admin" | "manager" | "dealer";
  full_name: string | null;
};

export type AuthState = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
};

/**
 * Сессия сотрудника + его роль.
 *
 * Роль читается из profiles, а не из метаданных пользователя: метаданные
 * пользователь может править сам через Auth API, а profiles закрыта RLS
 * на запись для всех, кроме админа.
 *
 * Отсутствие профиля при живой сессии — это НЕ сотрудник (например, кто-то
 * завёл пользователя, но не выдал роль). Такой в админку не попадает.
 */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (alive) setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (alive) setSession(s);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let alive = true;

    if (!session) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from("profiles")
      .select("id, role, full_name")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setProfile((data as Profile) ?? null);
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [session]);

  return { session, profile, loading };
}

export function isStaff(profile: Profile | null): boolean {
  return profile?.role === "admin" || profile?.role === "manager";
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
