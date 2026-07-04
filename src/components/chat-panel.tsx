'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center text-center text-sm text-zinc-500">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              开始与 Gemini 对话
            </p>
            <p className="mt-1 max-w-sm">
              使用 Vercel AI SDK 的 <code className="text-xs">useChat</code> 和{' '}
              <code className="text-xs">streamText</code> 实现流式回复
            </p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100'
                }`}
              >
                <p className="mb-1 text-xs font-medium opacity-70">
                  {message.role === 'user' ? '你' : 'Gemini'}
                </p>
                {message.parts.map((part, index) =>
                  part.type === 'text' ? (
                    <p key={index} className="whitespace-pre-wrap">
                      {part.text}
                    </p>
                  ) : null,
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error.message}
        </p>
      )}

      <form
        className="mt-4 flex gap-2"
        onSubmit={e => {
          e.preventDefault();
          if (!input.trim() || isBusy) return;
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isBusy}
          placeholder="输入消息，按 Enter 发送..."
          className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950"
        />
        {isBusy ? (
          <button
            type="button"
            onClick={stop}
            className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            停止
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            发送
          </button>
        )}
      </form>
    </div>
  );
}
