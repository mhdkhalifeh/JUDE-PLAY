
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

const ADMIN_EMAIL = "mhd.khalifeh89@gmail.com";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Gaming",
  seo_title: "",
  seo_description: "",
  published: false,
  cover_image: "",
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ArticlesAdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.email !== ADMIN_EMAIL) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);
      await loadArticles();
      setLoading(false);
    }

    init();
  }, []);

  async function loadArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setArticles((data || []) as Article[]);
  }

  function updateField(name: string, value: string | boolean) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);

    const fileInput = document.getElementById(
      "article-cover"
    ) as HTMLInputElement | null;

    if (fileInput) fileInput.value = "";
  }

  function editArticle(article: Article) {
    setEditingId(article.id);

    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content || "",
      category: article.category || "Gaming",
      seo_title: article.seo_title || "",
      seo_description: article.seo_description || "",
      published: article.published,
      cover_image: article.cover_image || "",
    });

    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadCover(slug: string) {
    if (!imageFile) return form.cover_image || null;

    const extension =
      imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${slug}/${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("article-images")
      .upload(filePath, imageFile, {
        upsert: false,
        contentType: imageFile.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("article-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function saveArticle(publish: boolean) {
    if (!form.title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    if (!form.content.trim()) {
      alert("Please enter article content.");
      return;
    }

    const slug =
      form.slug.trim() ||
      makeSlug(form.title) ||
      `article-${Date.now()}`;

    if (!/^[a-z0-9-]+$/.test(slug)) {
      alert("Slug must contain only English letters, numbers and hyphens.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const imageUrl = await uploadCover(slug);

      const existingArticle = articles.find(
        (article) => article.id === editingId
      );

      const articleData = {
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category.trim() || "Gaming",
        cover_image: imageUrl,
        seo_title: form.seo_title.trim() || form.title.trim(),
        seo_description:
          form.seo_description.trim() || form.excerpt.trim(),
        published: publish,
        published_at: publish
          ? existingArticle?.published_at || new Date().toISOString()
          : null,
      };

      let result;

      if (editingId) {
        result = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", editingId);
      } else {
        result = await supabase
          .from("articles")
          .insert(articleData);
      }

      if (result.error) throw result.error;

      resetForm();
      await loadArticles();

      setMessage(
        publish
          ? "Article published successfully!"
          : "Draft saved successfully!"
      );
    } catch (error: any) {
      alert(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle(article: Article) {
    if (
      !confirm(
        `Delete "${article.title}" permanently?`
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", article.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (editingId === article.id) resetForm();

    await loadArticles();
    setMessage("Article deleted successfully.");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        Loading admin...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070914] p-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-10 text-center">
          <h1 className="text-3xl font-black">Access Denied</h1>
          <p className="mt-4 text-slate-400">
            Only the JUDE Play administrator can access this page.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-fuchsia-400"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#070914] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-[0.3em] text-fuchsia-400">
              JUDE PLAY CMS
            </p>
            <h1 className="mt-3 text-4xl font-black">
              Articles Management
            </h1>
            <p className="mt-2 text-slate-400">
              Create, edit and publish your blog articles.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
          >
            ← Games Admin
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
            <p className="text-sm text-slate-400">Total Articles</p>
            <p className="mt-2 text-3xl font-black">
              {articles.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
            <p className="text-sm text-slate-400">Published</p>
            <p className="mt-2 text-3xl font-black text-emerald-400">
              {articles.filter((a) => a.published).length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
            <p className="text-sm text-slate-400">Drafts</p>
            <p className="mt-2 text-3xl font-black text-amber-400">
              {articles.filter((a) => !a.published).length}
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-cyan-300">
            {message}
          </div>
        )}

        <section className="rounded-3xl border border-white/10 bg-slate-950 p-6 md:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black">
              {editingId ? "Edit Article" : "Create New Article"}
            </h2>

            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Article Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter article title"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-fuchsia-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                URL Slug *
              </label>
              <input
                value={form.slug}
                onChange={(e) =>
                  updateField("slug", makeSlug(e.target.value))
                }
                placeholder="my-article-title"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-fuchsia-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                jude-play.com/blog/{form.slug || "article-slug"}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Category
              </label>
              <input
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                placeholder="Gaming"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-fuchsia-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Cover Image
              </label>
              <input
                id="article-cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm"
              />
              {imageFile && (
                <p className="mt-2 text-xs text-cyan-300">
                  {imageFile.name}
                </p>
              )}
              {form.cover_image && !imageFile && (
                <p className="mt-2 text-xs text-slate-400">
                  Current cover image is saved.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-400">
                Short Description
              </label>
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Write a short introduction for the article..."
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-fuchsia-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-400">
                Article Content *
              </label>
              <textarea
                rows={18}
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder={"Write your article here...\n\nSeparate paragraphs with an empty line."}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-5 leading-8 outline-none focus:border-fuchsia-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Separate paragraphs with an empty line. Formatting and headings can be added in a later editor upgrade.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                SEO Title
              </label>
              <input
                value={form.seo_title}
                onChange={(e) => updateField("seo_title", e.target.value)}
                placeholder="SEO title"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-fuchsia-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                SEO Description
              </label>
              <textarea
                rows={3}
                value={form.seo_description}
                onChange={(e) =>
                  updateField("seo_description", e.target.value)
                }
                placeholder="SEO meta description"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-fuchsia-500"
              />
            </div>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              disabled={saving}
              onClick={() => saveArticle(false)}
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-3 font-bold hover:bg-white/10 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              disabled={saving}
              onClick={() => saveArticle(true)}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-3 font-black hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Publish Article"}
            </button>
          </div>

        </section>

        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black">
              All Articles ({articles.length})
            </h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 bg-slate-950 p-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-black">
                      {article.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        article.published
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="mt-2 truncate text-sm text-slate-400">
                    /blog/{article.slug}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {article.category}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {article.published && (
                    <Link
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold hover:bg-cyan-700"
                    >
                      View
                    </Link>
                  )}

                  <button
                    onClick={() => editArticle(article)}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold hover:bg-violet-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteArticle(article)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filteredArticles.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-10 text-center text-slate-500">
                No articles found.
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
