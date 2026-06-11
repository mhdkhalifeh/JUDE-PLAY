"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

function getFriendlyError(message: string) {
  const text = message.toLowerCase();

  if (text.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (text.includes("user already registered")) {
    return "This email is already registered. Please login instead.";
  }

  if (text.includes("password")) {
    return "Password must be at least 6 characters.";
  }

  if (text.includes("email")) {
    return "Please enter a valid email address.";
  }

  return message || "Something went wrong. Please try again.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUp() {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(getFriendlyError(error.message));
      return;
    }

    window.location.href = `/signup-success?email=${encodeURIComponent(email)}`;
  }

  async function login() {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage("Invalid email or password.");
      return;
    }

    window.location.href = "/profile";
  }

  return (
    <main className="min-h-screen bg-[#070914] px-6 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl">
        <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
          JUDE PLAY
        </p>

        <h1 className="mt-4 text-4xl font-black">Login</h1>

        <p className="mt-3 text-sm text-slate-400">
          Login to save favorites, track your profile and continue playing.
        </p>

        <input
          type="email"
          placeholder="Email"
          className="mt-8 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fuchsia-500"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrorMessage("");
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fuchsia-500"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage("");
          }}
        />

        {errorMessage && (
          <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400">
            {errorMessage}
          </p>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-black disabled:opacity-60"
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <button
          onClick={signUp}
          disabled={loading}
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-black hover:bg-white/10 disabled:opacity-60"
        >
          Create Account
        </button>
      </div>
    </main>
  );
}