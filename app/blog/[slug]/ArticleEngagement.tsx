"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type Vote = 1 | -1;
type Votes = { likes: number; dislikes: number; my_vote: Vote | null };
type Comment = { id: string; body: string; created_at: string };

const PAGE_SIZE = 10;
const buttonClass = "rounded-xl border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10 disabled:opacity-50";

export default function ArticleEngagement({
  articleId,
  question,
}: {
  articleId: string;
  question: string;
}) {
  const [signedIn, setSignedIn] = useState(false);
  const [votes, setVotes] = useState<Votes | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user && !session.user.is_anonymous));
      setRevision((current) => current + 1);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    async function loadEngagement() {
      const [voteResult, commentResult] = await Promise.all([
        supabase.rpc("get_article_votes", { p_article_id: articleId }).single(),
        supabase.from("article_comments").select("id,body,created_at")
          .eq("article_id", articleId).eq("hidden", false)
          .order("created_at", { ascending: false }).order("id", { ascending: false })
          .limit(limit + 1),
      ]);
      if (!active) return;
      setLoading(false);
      setLoadError(voteResult.error || commentResult.error ? "Could not load article feedback." : "");
      if (!voteResult.error) setVotes(voteResult.data as Votes);
      if (!commentResult.error) setComments(commentResult.data ?? []);
    }
    void loadEngagement();
    return () => { active = false; };
  }, [articleId, limit, revision]);

  async function submitVote(vote: Vote) {
    setPending(true);
    setMessage("");
    const nextVote = votes?.my_vote === vote ? null : vote;
    const { error } = await supabase.rpc("set_article_vote", {
      p_article_id: articleId,
      p_vote: nextVote,
    });
    if (error) {
      setMessage("Could not save your vote. Please try again.");
    } else {
      setVotes((current) => current && ({
        likes: current.likes + Number(nextVote === 1) - Number(current.my_vote === 1),
        dislikes: current.dislikes + Number(nextVote === -1) - Number(current.my_vote === -1),
        my_vote: nextVote,
      }));
      setRevision((current) => current + 1);
    }
    setPending(false);
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim() || pending) return;
    setPending(true);
    setMessage("");
    const { error } = await supabase.rpc("post_article_comment", {
      p_article_id: articleId,
      p_body: body.trim(),
    });
    if (error) {
      setMessage(error.message === "Please wait 15 seconds between comments."
        ? error.message
        : "Could not post your comment. Please try again.");
    } else {
      setBody("");
      setMessage("Comment posted.");
      setRevision((current) => current + 1);
    }
    setPending(false);
  }

  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="text-lg font-extrabold">Was this article helpful?</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {([1, -1] as const).map((vote) => (
          <button key={vote} type="button"
            aria-pressed={signedIn && votes?.my_vote === vote}
            disabled={!signedIn || !votes || pending}
            onClick={() => void submitVote(vote)}
            className={`${buttonClass} ${signedIn && votes?.my_vote === vote ? "bg-fuchsia-500/25" : ""}`}>
            {vote === 1 ? "👍 Helpful" : "👎 Not helpful"}
            {votes && ` (${vote === 1 ? votes.likes : votes.dislikes})`}
          </button>
        ))}
      </div>

      <h2 className="mt-7 text-lg font-extrabold">Comments</h2>
      <p className="mt-2 text-sm text-slate-300" dir="auto">{question}</p>
      {!loading && !signedIn && (
        <Link href="/login" className="mt-3 inline-block text-sm font-bold text-cyan-300 hover:underline">
          Sign in to vote or comment
        </Link>
      )}
      {signedIn && (
        <form onSubmit={submitComment} className="mt-4">
          <label htmlFor="article-comment" className="sr-only">Your comment</label>
          <textarea id="article-comment" value={body} dir="auto" required maxLength={1000}
            onChange={(event) => setBody(event.target.value)}
            rows={3} placeholder="Write a comment…"
            className="w-full rounded-xl border border-white/15 bg-slate-950 p-3 text-sm" />
          <button type="submit" disabled={pending || !body.trim()} className={`mt-2 ${buttonClass}`}>
            Post comment
          </button>
        </form>
      )}
      {message && <p role="status" className="mt-3 text-sm text-cyan-200">{message}</p>}
      {loadError && (
        <p role="status" className="mt-3 text-sm text-amber-200">
          {loadError}{" "}
          <button type="button" className="underline" onClick={() => setRevision((current) => current + 1)}>Retry</button>
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-slate-400">Loading feedback…</p>}
      {!loading && !loadError && comments.length === 0 && <p className="mt-4 text-sm text-slate-400">No comments yet.</p>}
      <ul className="mt-4 divide-y divide-white/10">
        {comments.slice(0, limit).map((comment) => (
          <li key={comment.id} className="py-3">
            <time dateTime={comment.created_at} className="text-xs text-slate-400">
              {new Date(comment.created_at).toLocaleDateString("en", { dateStyle: "medium", timeZone: "UTC" })}
            </time>
            <p dir="auto" className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-200">{comment.body}</p>
          </li>
        ))}
      </ul>
      {comments.length > limit && (
        <button type="button" className={buttonClass} onClick={() => setLimit(limit + PAGE_SIZE)}>Load more</button>
      )}
    </section>
  );
}
