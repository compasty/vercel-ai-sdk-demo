import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { chatModel } from '@/lib/ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: '请设置 GOOGLE_GENERATIVE_AI_API_KEY 环境变量' },
      { status: 500 },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: chatModel,
    instructions:
      'You are a helpful assistant powered by Google Gemini. Reply in the same language as the user.',
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
