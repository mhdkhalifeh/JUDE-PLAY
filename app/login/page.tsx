"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 async function signUp() {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Account created successfully. Please check your email if confirmation is required.");
}

  async function login() {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "/profile";
}
  return (
    <div className="min-h-screen bg-[#070914] p-8 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-950 p-8">
        <h1 className="text-4xl font-black">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="mt-8 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fuchsia-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fuchsia-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-black"
        >
          Login
        </button>

        <button
          onClick={signUp}
          className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-black hover:bg-white/10"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}