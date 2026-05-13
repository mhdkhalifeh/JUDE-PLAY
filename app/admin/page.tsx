"use client";

import { useEffect, useState } from "react";
import { games as defaultGames } from "@/app/data/games";

export default function AdminPage() {
  const [games, setGames] = useState<any[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    meta: "",
    description: "",
    plays: "0",
    rating: "5.0",
    status: "Free",
    image: "",
    gameUrl: "",
  });

  useEffect(() => {
    const savedGames = localStorage.getItem("jude_games");

    if (savedGames) {
      setGames(JSON.parse(savedGames));
    } else {
      setGames(defaultGames);
      localStorage.setItem("jude_games", JSON.stringify(defaultGames));
    }
  }, []);

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function addGame(e: any) {
    e.preventDefault();

    let gameUrl = form.gameUrl;

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

    const updatedGames = [
      ...games,
      {
        ...form,
        gameUrl,
      },
    ];

    setGames(updatedGames);
    localStorage.setItem("jude_games", JSON.stringify(updatedGames));

    setForm({
      title: "",
      slug: "",
      category: "",
      meta: "",
      description: "",
      plays: "0",
      rating: "5.0",
      status: "Free",
      image: "",
      gameUrl: "",
    });

    setZipFile(null);
  }

  function deleteGame(slug: string) {
    const updatedGames = games.filter((game) => game.slug !== slug);

    setGames(updatedGames);
    localStorage.setItem("jude_games", JSON.stringify(updatedGames));
  }

  return (
    <div className="min-h-screen bg-[#070914] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-black">Admin Dashboard</h1>

        <p className="mt-3 text-slate-400">
          Add, upload, save, and manage games on JUDE Play.
        </p>

        <form
          onSubmit={addGame}
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
                Selected: {zipFile.name}
              </p>
            )}
          </div>

          <button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-black md:col-span-2">
            Add Game
          </button>
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

                {game.gameUrl && (
                  <p className="mt-3 break-all text-xs text-cyan-300">
                    Game URL: {game.gameUrl}
                  </p>
                )}

                <button
                  onClick={() => deleteGame(game.slug)}
                  className="mt-5 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}