'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Comment } from '@/types/drug';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { useDeviceId } from '@/hooks/useDeviceId';
import { isCommentLiked, toggleLikedComment } from '@/lib/localStorage';
import { CommentForm } from './CommentForm';

interface Props {
  drugId: number;
}

export function CommentSection({ drugId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const deviceId = useDeviceId();

  const fetchComments = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const client = getSupabaseClient();
    if (!client) { setLoading(false); return; }

    // VIEWを使わず comments テーブルに直接クエリ
    const { data: commentsData, error } = await client
      .from('comments')
      .select('*')
      .eq('drug_id', drugId)
      .order('created_at', { ascending: false });

    if (error || !commentsData) { setLoading(false); return; }

    // いいね数を comment_likes テーブルから集計
    const ids = commentsData.map((row) => row.id as string);
    let likeCountMap: Record<string, number> = {};
    if (ids.length > 0) {
      const { data: likesData } = await client
        .from('comment_likes')
        .select('comment_id')
        .in('comment_id', ids);

      (likesData ?? []).forEach((row) => {
        const cid = row.comment_id as string;
        likeCountMap[cid] = (likeCountMap[cid] ?? 0) + 1;
      });
    }

    const merged: Comment[] = commentsData.map((row) => ({
      id: row.id as string,
      drug_id: row.drug_id as number,
      device_id: row.device_id as string,
      body: row.body as string,
      created_at: row.created_at as string,
      like_count: likeCountMap[row.id as string] ?? 0,
    }));

    // いいね順 → 日時順に並べ替え
    merged.sort((a, b) => b.like_count - a.like_count || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setComments(merged);
    const liked = new Set(merged.filter((c) => isCommentLiked(c.id)).map((c) => c.id));
    setLikedIds(liked);
    setLoading(false);
  }, [drugId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleLike = async (commentId: string) => {
    const client = getSupabaseClient();
    if (!deviceId || !isSupabaseConfigured || !client) return;
    const isNowLiked = toggleLikedComment(commentId);

    if (isNowLiked) {
      await client.from('comment_likes').insert({ comment_id: commentId, device_id: deviceId });
    } else {
      await client
        .from('comment_likes')
        .delete()
        .match({ comment_id: commentId, device_id: deviceId });
    }

    setLikedIds((prev) => {
      const next = new Set(prev);
      if (isNowLiked) next.add(commentId);
      else next.delete(commentId);
      return next;
    });
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, like_count: c.like_count + (isNowLiked ? 1 : -1) } : c
      )
    );
  };

  const handlePost = async (body: string) => {
    const client = getSupabaseClient();
    if (!deviceId || !isSupabaseConfigured || !client) return;
    await client.from('comments').insert({ drug_id: drugId, device_id: deviceId, body });
    await fetchComments();
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        コメント機能を使用するにはSupabaseの設定が必要です
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-gray-900 dark:text-white">
        💬 みんなの覚え方
      </h3>

      <CommentForm onSubmit={handlePost} />

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">読み込み中...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          まだコメントはありません。最初に投稿してみましょう！
        </p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3"
            >
              <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                {comment.body}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('ja-JP')}
                </span>
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1 text-sm px-2 py-1 rounded-lg transition-colors ${
                    likedIds.has(comment.id)
                      ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {likedIds.has(comment.id) ? '❤️' : '🤍'} {comment.like_count}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
