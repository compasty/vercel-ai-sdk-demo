import { generateImage } from 'ai';
import { imageModel } from '@/lib/ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: '请设置 GOOGLE_GENERATIVE_AI_API_KEY 环境变量' },
      { status: 500 },
    );
  }

  const { prompt, aspectRatio = '1:1' } = await req.json();

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return Response.json({ error: '请输入图片描述' }, { status: 400 });
  }

  try {
    const { image, warnings } = await generateImage({
      model: imageModel,
      prompt: prompt.trim(),
      aspectRatio,
    });

    return Response.json({
      base64: image.base64,
      mediaType: image.mediaType,
      warnings,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '图片生成失败，请稍后重试';
    return Response.json({ error: message }, { status: 500 });
  }
}
