"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Comment = { id: string; body: string; created_at: string; hidden: boolean };
const PAGE_SIZE = 20;

function CommentsList({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function loadComments() {
      const start = page * PAGE_SIZE;
      const { data, error } = await supabase.from("article_comments")
        .select("id,body,created_at,hidden")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false }).order("id", { ascending: false })
        .range(start, start + PAGE_SIZE);
      if (!active) return;
      setLoading(false);
      if (error) {
        setMessage("Could not load comments.");
        return;
      }
      setComments(data ?? []);
    }
    void loadComments();
    return () => { active = false; };
  }, [articleId, page]);

  function goToPage(nextPage: number) {
    setMessage("");
    setLoading(true);
    setPage(nextPage);
  }

  async function changeVisibility(comment: Comment) {
    setPendingId(comment.id);
    setMessage("");
    const hidden = !comment.hidden;
    const { error } = await supabase.from("article_comments")
      .update({ hidden }).eq("id", comment.id).select("id").single();
    if (error) setMessage("Could not change comment visibility.");
    else {
      setComments((current) => current.map((item) => item.id === comment.id ? { ...item, hidden } : item));
      setMessage(hidden ? "Comment hidden." : "Comment restored.");
    }
    setPendingId(null);
  }

  return (
    <>
      {message && <p role="status" className="mt-3 text-sm text-cyan-200">{message}</p>}
      {loading ? <p className="mt-3 text-sm text-slate-400">Loading comments…</p> : (
        <>
          {!message && comments.length === 0 && <p className="mt-3 text-sm text-slate-400">No comments on this page.</p>}
          <ul className="mt-4 divide-y divide-white/10">
            {comments.slice(0, PAGE_SIZE).map((comment) => (
              <li key={comment.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p dir="auto" className="whitespace-pre-wrap break-words text-slate-200">{comment.body}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    <time dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleString()}</time>
                    {" · "}{comment.hidden ? "Hidden" : "Visible"}
                  </p>
                </div>
                <button type="button" disabled={pendingId !== null} className="rounded-lg border border-white/15 px-3 py-2 text-sm disabled:opacity-50"
                  onClick={() => void changeVisibility(comment)}>
                  {comment.hidden ? "Restore" : "Hide"}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-3 flex gap-4 text-sm text-cyan-200">
        {page > 0 && <button type="button" disabled={loading || pendingId !== null} onClick={() => goToPage(page - 1)}>Previous page</button>}
        {comments.length > PAGE_SIZE && <button type="button" disabled={loading || pendingId !== null} onClick={() => goToPage(page + 1)}>Next page</button>}
      </div>
    </>
  );
}

export default function ArticleCommentsAdmin({ articles }: { articles: { id: string; title: string }[] }) {
  const [selectedId, setSelectedId] = useState("");
  return (
    <section className="mb-8 rounded-3xl border border-white/10 bg-slate-950 p-6 md:p-8">
      <h2 className="text-2xl font-black">Moderate comments</h2>
      <label htmlFor="moderation-article" className="mt-4 block text-sm text-slate-300">Article</label>
      <select id="moderation-article" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}
        className="mt-2 w-full max-w-lg rounded-xl border border-white/15 bg-slate-900 px-4 py-3">
        <option value="">Choose an article</option>
        {articles.map((article) => <option key={article.id} value={article.id}>{article.title}</option>)}
      </select>
      {articles.some((article) => article.id === selectedId) && <CommentsList key={selectedId} articleId={selectedId} />}
    </section>
  );
}
