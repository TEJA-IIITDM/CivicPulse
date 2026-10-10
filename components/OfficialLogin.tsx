
"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function OfficialLogin() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) setMessage(error.message);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setErrorMessage(true);
    } else if (data.user?.app_metadata?.role !== "official") {
      await supabase.auth.signOut();
      setUser(null);
      setMessage("This account is not authorized as an official.");
      setErrorMessage(true);
    } else {
      setUser(data.user);
      setPassword("");
      setMessage("Login successful.");
    }

    setLoading(false);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setMessage(error ? error.message : "You have signed out.");
    setErrorMessage(Boolean(error));
  }

  if (loading) {
    return (
      <p className="p-4 text-center text-sm text-slate-700">
        Checking login...
      </p>
    );
  }

  if (user?.app_metadata?.role === "official") {
    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-900">
          Official account verified
        </p>
        <p className="mt-1 break-all text-sm text-slate-700">
          {user.email}
        </p>
        <button
          type="button"
          onClick={signOut}
          className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-100"
        >
          Sign out
        </button>
        {message && (
          <p className="mt-3 text-sm text-slate-700">{message}</p>
        )}
      </section>
    );
  }

  return (
    <form onSubmit={signIn} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Official Login
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Sign in with your authorized municipal account.
        </p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          Email address
        </span>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="official@municipality.gov"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          Password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-800 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in securely"}
      </button>

      {message && (
        <p
          role="status"
          className={`rounded-lg p-3 text-sm ${
            errorMessage
              ? "border border-red-200 bg-red-50 text-red-800"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
