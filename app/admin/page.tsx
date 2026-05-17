"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AdminPage() {
  const [games, setGames] = useState<any[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const emptyForm = {
    title: "",
    slug: "",
    category: "",
    meta: "",
    description: "",
    plays: "0",
    rating: "5.0",
    status: "Free",
    image: "",
    game_url: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      
      const adminEmail = "mhd.khalifeh89@gmail.com";

if (user && user.email !== adminEmail) {
  setUser(null);
  setLoading(false);
  return;
}
setUser(user);
      if (user) {
        await loadGames();
      }

      setLoading(false);
    }

    init();
  }, []);

  async function loadGames() {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGames(data);
    }
  }

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function uploadImage(slug: string) {
    if (!imageFile) return form.image;

    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${slug}/cover.${fileExt}`;

    const { error } = await supabase.storage
      .from("game-images")
      .upload(filePath, imageFile, {
        upsert: true,
      });

    if (error) {
      alert(error.message);
      return form.image;
    }

    const { data } = supabase.storage
      .from("game-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  function resetForm() {
    setForm(emptyForm);
    setZipFile(null);
    setImageFile(null);
    setEditingSlug(null);
  }

  async function addGame(e: any) {
    e.preventDefault();

    const imageUrl = await uploadImage(form.slug);
    let gameUrl = form.game_url;

    if (zipFile) {
      const data = new FormData();
      data.append("file", zipFile);
      data.append("slug", form.slug);

      const res = await fetch("/api/upload-game", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Upload failed");
        return;
      }

      gameUrl = result.gameUrl;
    }

    const { error } = await supabase.from("games").insert({
      title: form.title,
      slug: form.slug,
      category: form.category,
      meta: form.meta,
      description: form.description,
      plays: Number(form.plays || 0),
      rating: form.rating,
      status: form.status,
      image: imageUrl,
      game_url: gameUrl,
    });

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();
    await loadGames();
  }

  function startEdit(game: any) {
    setEditingSlug(game.slug);

    setForm({
      title: game.title || "",
      slug: game.slug || "",
      category: game.category || "",
      meta: game.meta || "",
      description: game.description || "",
      plays: String(game.plays || "0"),
      rating: String(game.rating || "5.0"),
      status: game.status || "Free",
      image: game.image || "",
      game_url: game.game_url || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function updateGame(e: any) {
    e.preventDefault();

    if (!editingSlug) return;

    const imageUrl = await uploadImage(form.slug);
    let gameUrl = form.game_url;

    if (zipFile) {
      const data = new FormData();
      data.append("file", zipFile);
      data.append("slug", form.slug);

      const res = await fetch("/api/upload-game", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Upload failed");
        return;
      }

      gameUrl = result.gameUrl;
    }

    const { error } = await supabase
      .from("games")
      .update({
        title: form.title,
        slug: form.slug,
        category: form.category,
        meta: form.meta,
        description: form.description,
        plays: Number(form.plays || 0),
        rating: form.rating,
        status: form.status,
        image: imageUrl,
        game_url: gameUrl,
      })
      .eq("slug", editingSlug);

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();
    await loadGames();
  }

  async function deleteGame(slug: string) {
    const confirmDelete = confirm("Are you sure you want to delete this game?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("games").delete().eq("slug", slug);

    if (error) {
      alert(error.message);
      return;
    }

    await loadGames();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-center">
          <h1 className="text-3xl font-black">Access Denied</h1>
          <p className="mt-3 text-slate-400">Please login to access admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070914] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-black">Admin Dashboard</h1>

        <p className="mt-3 text-slate-400">
          Add, edit, upload, save, and manage games on JUDE Play.
        </p>

        <form
          onSubmit={editingSlug ? updateGame : addGame}
          className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-slate-950 p-6 md:grid-cols-2"
        >
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              value={(form as any)[key]}
              onChange={handleChange}
              placeholder={key}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fuchsia-500"
            />
          ))}

          <div className="rounded-xl border border-white/10 bg-black/40 p-4 md:col-span-2">
            <p className="mb-2 text-sm text-slate-400">Upload Game Image</p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-slate-300"
            />

            {imageFile && (
              <p className="mt-3 text-sm text-cyan-300">
                Selected image: {imageFile.name}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-4 md:col-span-2">
            <p className="mb-2 text-sm text-slate-400">
              Upload HTML5 Game ZIP
            </p>

            <input
              type="file"
              accept=".zip"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setZipFile(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-slate-300"
            />

            {zipFile && (
              <p className="mt-3 text-sm text-fuchsia-300">
                Selected ZIP: {zipFile.name}
              </p>
            )}
          </div>

          <button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-black md:col-span-2">
            {editingSlug ? "Update Game" : "Add Game"}
          </button>

          {editingSlug && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-black hover:bg-white/10 md:col-span-2"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {games.map((game) => (
            <div
              key={game.slug}
              className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950"
            >
              {game.image ? (
                <img
                  src={game.image}
                  alt={game.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-slate-900 text-slate-500">
                  No Image
                </div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-black">{game.title}</h3>

                <p className="mt-2 text-sm text-slate-400">{game.meta}</p>

                <p className="mt-3 text-sm text-fuchsia-300">
                  {game.category}
                </p>

                {game.game_url && (
                  <p className="mt-3 break-all text-xs text-cyan-300">
                    Game URL: {game.game_url}
                  </p>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => startEdit(game)}
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold hover:bg-cyan-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteGame(game.slug)}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}