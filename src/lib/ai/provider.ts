import { google } from '@ai-sdk/google';

/**
 * Singleton model instance using Google Gemini 3.8 Flash.
 * Automatically authenticates via GOOGLE_GENERATIVE_AI_API_KEY env variable.
 */
export const model = google('gemini-3.8-flash');
