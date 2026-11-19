"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

type RatingStats = {
  game_id: string;
  average_rating: number | string | null;
  total_ratings: number | string;
};


export default function AdminPage() {
  const [games, setGames] = useState<any[]>([]);
  const [publishFilter, setPublishFilter] = useState<
  "all" | "published" | "draft"
>("all");

const [gameSearch, setGameSearch] = useState("");

const [contentFilter, setContentFilter] = useState<
  "all" | "complete" | "review"
>("all");

function getContentQuality(game: any) {
  const fields = [
    "description",
    "how_to_play",
    "controls",
    "tips",
  ];

  const completed = fields.filter((field) => {
    const value = game[field];
    return typeof value === "string" && value.trim().length > 0;
  }).length;

  return {
    completed,
    total: fields.length,
    percent: Math.round((completed / fields.length) * 100),
    complete: completed === fields.length,
  };
}

  const [ratings, setRatings] = useState<Record<string, RatingStats>>({});
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [fileReset, setFileReset] = useState(0);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const emptyForm = {
    title: "",
    slug: "",
    category: "",
    meta: "",
    description: "",
    plays: "0",
    status: "Free",
    image: "",
    game_url: "",
    how_to_play: "",
    controls: "",
    tips: "",
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
    const [gamesResult, ratingsResult] = await Promise.all([
      supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.rpc("get_all_game_rating_stats"),
    ]);

    if (gamesResult.error) {
      console.error("Unable to load games:", gamesResult.error.message);
    } else {
      setGames(gamesResult.data || []);
    }

    if (ratingsResult.error) {
      console.error("Unable to load player ratings:", ratingsResult.error.message);
      setRatings({});
    } else {
      const statsByGame: Record<string, RatingStats> = {};
      for (const item of (ratingsResult.data || []) as RatingStats[]) {
        statsByGame[item.game_id] = item;
      }
      setRatings(statsByGame);
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
      throw new Error("Image upload failed: " + error.message);
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
    setFileReset(value => value + 1);
  }

  async function saveGame(e: any, editing: boolean) {
    e.preventDefault();
    if (savingRef.current || (editing && !editingSlug)) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError("");
    try {
      const slug = form.slug.trim();
      if (!form.title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error("Enter a title and a lowercase slug such as judoku.");
      }
      let gameUrl = form.game_url.trim();
      if (zipFile) {
        if (zipFile.size > 4 * 1024 * 1024) {
          throw new Error("ZIP must be smaller than 4 MB. Use the optimized web version.");
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Please log in again.");
        const body = new FormData();
        body.append("file", zipFile);
        body.append("slug", slug);
        const response = await fetch("/api/upload-game", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
          body,
        });
        const text = await response.text();
        let result: any;
        try { result = JSON.parse(text); }
        catch {
          throw new Error(response.status === 413
            ? "The host rejected the upload size. Use the optimized ZIP."
            : `Upload failed (HTTP ${response.status}). Check the server deployment logs.`);
        }
        if (!response.ok || result.success !== true) {
          throw new Error(result.error || "Game upload failed.");
        }
        if (typeof result.gameUrl !== "string" || !result.gameUrl.trim()) {
          throw new Error("Upload did not return a gameUrl. Nothing was saved. Check /api/upload-game.");
        }
        gameUrl = result.gameUrl.trim();
        // Keep a successful upload available if saving the database record needs retrying.
        setForm(previous => ({ ...previous, game_url: gameUrl }));
        setZipFile(null);
        setFileReset(value => value + 1);
      }
      if (!gameUrl || !(/^(https?:\/\/|\/(?!\/))/.test(gameUrl))) {
        throw new Error("Upload the game ZIP or enter a valid game URL before saving.");
      }
      const imageUrl = await uploadImage(slug);
      const payload = {
        title: form.title.trim(), slug, category: form.category,
        meta: form.meta, description: form.description,
        plays: Number(form.plays || 0), status: form.status,
        image: imageUrl, game_url: gameUrl,
        how_to_play: form.how_to_play, controls: form.controls, tips: form.tips,
      };
      const result = editing
        ? await supabase.from("games").update(payload).eq("slug", editingSlug)
        : await supabase.from("games").insert({ ...payload, is_published: false });
      if (result.error) throw new Error(result.error.message);
      resetForm();
      await loadGames();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save game.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  async function addGame(e: any) { await saveGame(e, false); }

  function startEdit(game: any) {
    setEditingSlug(game.slug);

    setForm({
      title: game.title || "",
      slug: game.slug || "",
      category: game.category || "",
      meta: game.meta || "",
      description: game.description || "",
      plays: String(game.plays || "0"),
      status: game.status || "Free",
      image: game.image || "",
      game_url: game.game_url || "",
      how_to_play: game.how_to_play || "",
      controls: game.controls || "",
      tips: game.tips || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function updateGame(e: any) { await saveGame(e, true); }

async function togglePublish(game: any) {
  const nextStatus = !game.is_published;
  if (nextStatus && !game.game_url?.trim()) {
    alert("Add a working game URL before publishing this game.");
    return;
  }

  const confirmed = window.confirm(
    nextStatus
      ? `Publish "${game.title}" on JUDE Play?`
      : `Unpublish "${game.title}" and hide it from visitors?`
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("games")
    .update({ is_published: nextStatus })
    .eq("id", game.id);

  if (error) {
    alert("Unable to update publishing status: " + error.message);
    return;
  }

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


const filteredGames = games.filter((game) => {
  const matchesStatus =
    publishFilter === "all" ||
    (publishFilter === "published" && game.is_published === true) ||
    (publishFilter === "draft" && game.is_published !== true);

  const searchText =
    `${game.title || ""} ${game.slug || ""} ${game.category || ""}`
      .toLowerCase();


const quality = getContentQuality(game);

const matchesContent =
  contentFilter === "all" ||
  (contentFilter === "complete" && quality.complete) ||
  (contentFilter === "review" && !quality.complete);


  return (
  matchesStatus &&
  searchText.includes(gameSearch.trim().toLowerCase()) &&
  matchesContent
);
});

const publishedCount = games.filter(
  (game) => game.is_published === true
).length;

const draftCount = games.length - publishedCount;


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
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black md:text-5xl">
              Admin Dashboard
            </h1>
            <p className="mt-3 text-slate-400">
              Add, edit, upload, save, and manage games on JUDE Play.
            </p>
          </div>

          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-500/40 bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-bold text-white transition hover:opacity-90"
          >
            <span aria-hidden="true">📝</span>
            Articles Management
          </Link>
        </div>


{/* QUICK GAME FINDER */}
<div className="mt-8 rounded-2xl border border-fuchsia-500/20 bg-[#101322] p-5">
  <div className="mb-4">
    <h2 className="text-xl font-black text-white">
      🔎 Quick Game Finder
    </h2>
    <p className="mt-1 text-sm text-slate-400">
      Search by game title, slug or category.
    </p>
  </div>

  <input
    type="search"
    value={gameSearch}
    onChange={(e) => setGameSearch(e.target.value)}
    placeholder="Type a game name, e.g. Alphabet Mahjong..."
    className="w-full rounded-xl border border-white/10 bg-[#080b16] px-5 py-4 text-base text-white outline-none transition focus:border-fuchsia-500"
  />

  {gameSearch.trim() && (
    <div className="mt-4 space-y-2">
      {(() => {
        const search = gameSearch.trim().toLowerCase();

        const matches = games
          .filter((game) =>
            [
              game.title,
              game.slug,
              game.category,
            ].some((value) =>
              String(value || "")
                .toLowerCase()
                .includes(search)
            )
          )
          .slice(0, 10);

        return matches.length > 0 ? (
          <>
            {matches.map((game) => (
              <div
                key={game.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                {game.image ? (
                  <img
                    src={game.image}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-white/10" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-white">
                    {game.title}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {game.category} · {game.slug}
                  </p>

                  <p className="mt-1 text-xs">
                    <span
                      className={
                        game.is_published
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      {game.is_published
                        ? "Published"
                        : "Draft"}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    startEdit(game);
                    setGameSearch("");
                  }}
                  className="shrink-0 rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-fuchsia-500"
                >
                  Edit
                </button>
              </div>
            ))}

            <p className="pt-2 text-xs text-slate-500">
              Showing up to 10 matching games
            </p>
          </>
        ) : (
          <p className="py-4 text-center text-sm text-slate-400">
            No matching games found.
          </p>
        );
      })()}
    </div>
  )}
</div>


        <form
          onSubmit={editingSlug ? updateGame : addGame}
          className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-slate-950 p-6 md:grid-cols-2"
        >
        
{saveError && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200 md:col-span-2">{saveError}</p>}
<fieldset disabled={saving} className="contents">
{Object.keys(form).map((key) => {
  const longTextFields = [
    "description",
    "how_to_play",
    "controls",
    "tips",
  ];

  if (longTextFields.includes(key)) {
    return (
      <div key={key} className="md:col-span-2">
        <label className="mb-2 block text-sm font-bold text-slate-300">
          {key.replaceAll("_", " ").toUpperCase()}
        </label>

        <textarea
          name={key}
          value={(form as any)[key]}
          onChange={handleChange}
          rows={key === "description" ? 5 : 4}
          placeholder={`Enter ${key.replaceAll("_", " ")}...`}
          className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-fuchsia-500"
        />
      </div>
    );
  }

  return (
    <input
      key={key}
      name={key}
      value={(form as any)[key]}
      onChange={handleChange}
      placeholder={key.replaceAll("_", " ")}
      className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fuchsia-500"
    />
  );
})}


          <div className="rounded-xl border border-white/10 bg-black/40 p-4 md:col-span-2">
            <p className="mb-2 text-sm text-slate-400">Upload Game Image</p>

            <input
              key={`image-${fileReset}`}
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
              key={`zip-${fileReset}`}
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

<button
  type="button"
  onClick={async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      alert("Please log in again.");
      return;
    }

    const res = await fetch("/api/import-games", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Import failed");
      return;
    }

    alert(result.message);

    if (result.errors?.length) {
      console.error("Import errors:", result.errors);
    }

    await loadGames();
  }}
  className="rounded-xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
>
  Import Games
</button>

          <button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-black md:col-span-2">
            {saving ? "Uploading & saving…" : editingSlug ? "Update Game" : "Add Game"}
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
        </fieldset>
        </form>


<div className="mt-10 flex flex-wrap items-center justify-between gap-4">
  <div className="flex flex-wrap gap-2">
    {[
      { id: "all", label: "All Games", count: games.length },
      {
        id: "published",
        label: "Published",
        count: publishedCount,
      },
      {
        id: "draft",
        label: "Drafts",
        count: draftCount,
      },
    ].map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() =>
          setPublishFilter(
            item.id as "all" | "published" | "draft"
          )
        }
        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
          publishFilter === item.id
            ? "bg-fuchsia-600 text-white"
            : "border border-white/10 bg-slate-950 text-slate-400 hover:text-white"
        }`}
      >
        {item.label} ({item.count})
      </button>

      
    ))}
  </div>

<div className="mt-5 flex flex-wrap items-center gap-2">
  {[
    { id: "all", label: "All Content" },
    { id: "complete", label: "Complete" },
    { id: "review", label: "Needs Review" },
  ].map((item) => (
    <button
      key={item.id}
      type="button"
      onClick={() =>
        setContentFilter(
          item.id as "all" | "complete" | "review"
        )
      }
      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
        contentFilter === item.id
          ? "bg-fuchsia-600 text-white"
          : "border border-white/10 bg-slate-950 text-slate-400 hover:text-white"
      }`}
    >
      {item.label}
    </button>
  ))}
</div>

  <input
    type="search"
    value={gameSearch}
    onChange={(e) => setGameSearch(e.target.value)}
    placeholder="Search games..."
    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500 sm:w-72"
  />
</div>

          

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredGames.map((game) => (
            <div
              key={game.slug}
              className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950"
            >
              {game.image ? (
                <img
                loading="lazy"
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

<div className="mb-3">
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
      game.is_published
        ? "bg-emerald-500/15 text-emerald-400"
        : "bg-amber-500/15 text-amber-400"
    }`}
  >
    {game.is_published ? "● Published" : "● Draft"}
  </span>
</div>

                <h3 className="text-xl font-black">{game.title}</h3>

{(() => {
  const quality = getContentQuality(game);

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-400">
          Content Completeness
        </span>

        <span
          className={
            quality.complete
              ? "font-bold text-emerald-400"
              : "font-bold text-amber-400"
          }
        >
          {quality.percent}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${
            quality.complete
              ? "bg-emerald-400"
              : "bg-amber-400"
          }`}
          style={{ width: `${quality.percent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {quality.complete
          ? "All content fields completed"
          : `${quality.total - quality.completed} fields remaining`}
      </p>
    </div>
  );
})()}

                <p className="mt-2 text-sm text-slate-400">{game.meta}</p>

                <p className="mt-3 text-sm text-fuchsia-300">
                  {game.category}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-slate-400">
                    ▶ {Number(game.plays || 0).toLocaleString()} plays
                  </span>
                  <span className="font-bold text-yellow-400">
                    {Number(ratings[game.id]?.total_ratings || 0) > 0 &&
                    ratings[game.id]?.average_rating != null
                      ? `★ ${Number(ratings[game.id].average_rating).toFixed(1)} (${Number(ratings[game.id].total_ratings)})`
                      : "☆ Not Rated"}
                  </span>
                </div>

                {game.game_url && (
                  <p className="mt-3 break-all text-xs text-cyan-300">
                    Game URL: {game.game_url}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={() => togglePublish(game)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                        game.is_published
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {game.is_published ? "Unpublish" : "Publish"}
                    </button>


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