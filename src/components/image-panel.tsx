'use client';

import { useState } from 'react';

const aspectRatios = [
  { value: '1:1', label: '1:1 方形' },
  { value: '16:9', label: '16:9 横屏' },
  { value: '9:16', label: '9:16 竖屏' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
] as const;

export function ImagePanel() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] =
    useState<(typeof aspectRatios)[number]['value']>('1:1');
  const [imageData, setImageData] = useState<{
    base64: string;
    mediaType: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageData(null);

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? '图片生成失败');
      }

      setImageData({
        base64: data.base64,
        mediaType: data.mediaType ?? 'image/png',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '图片生成失败');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <form onSubmit={handleGenerate} className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          图片描述
        </label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={isLoading}
          rows={3}
          placeholder="例如：一只戴着巫师帽的橘猫，坐在星空下的草地上，水彩风格"
          className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950"
        />

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            宽高比
          </label>
          <select
            value={aspectRatio}
            onChange={e =>
              setAspectRatio(
                e.target.value as (typeof aspectRatios)[number]['value'],
              )
            }
            disabled={isLoading}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {aspectRatios.map(ratio => (
              <option key={ratio.value} value={ratio.value}>
                {ratio.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="ml-auto rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? '生成中...' : '生成图片'}
          </button>
        </div>
      </form>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        {isLoading ? (
          <div className="text-center text-sm text-zinc-500">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            Gemini 正在绘制图片...
          </div>
        ) : imageData ? (
          <img
            src={`data:${imageData.mediaType};base64,${imageData.base64}`}
            alt={prompt}
            className="max-h-full max-w-full rounded-xl object-contain shadow-lg"
          />
        ) : (
          <div className="max-w-sm text-center text-sm text-zinc-500">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              文生图示例
            </p>
            <p className="mt-1">
              使用 <code className="text-xs">generateImage</code> 调用{' '}
              <code className="text-xs">gemini-3.1-flash-image-preview</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
