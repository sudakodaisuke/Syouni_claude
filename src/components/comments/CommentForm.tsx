'use client';

import { useState } from 'react';

interface Props {
  onSubmit: (body: string) => Promise<void>;
}

export function CommentForm({ onSubmit }: Props) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(body.trim());
    setBody('');
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="覚え方・語呂合わせを投稿..."
        maxLength={500}
        rows={2}
        className="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={!body.trim() || submitting}
        className="self-end px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-95 transition-transform"
      >
        投稿
      </button>
    </form>
  );
}
