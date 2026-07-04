import { google } from '@ai-sdk/google';

export const chatModel = google('gemini-2.5-flash');

export const imageModel = google.image('gemini-3.1-flash-image-preview');
