'use client';

import { useState } from 'react';
import { ChatPanel } from '@/components/chat-panel';
import { ImagePanel } from '@/components/image-panel';

type Tab = 'chat' | 'image';

export function AppDemo() {
  const [tab, setTab] = useState<Tab>('chat');

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Vercel AI SDK + Google Gemini
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI SDK 示例应用
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          演示如何使用 Vercel AI SDK 调用 Gemini 模型，包含流式聊天（
          <code className="text-xs">streamText</code> +{' '}
          <code className="text-xs">useChat</code>）和文生图（
          <code className="text-xs">generateImage</code>）。
        </p>
      </header>

      <div className="mb-4 inline-flex w-fit rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => setTab('chat')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === 'chat'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          聊天
        </button>
        <button
          type="button"
          onClick={() => setTab('image')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === 'image'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
        >
          文生图
        </button>
      </div>

      <div className="min-h-0 flex-1 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {tab === 'chat' ? <ChatPanel /> : <ImagePanel />}
      </div>

      <footer className="mt-6 text-center text-xs text-zinc-500">
        需要配置环境变量{' '}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-900">
          GOOGLE_GENERATIVE_AI_API_KEY
        </code>
      </footer>
    </div>
  );
}
