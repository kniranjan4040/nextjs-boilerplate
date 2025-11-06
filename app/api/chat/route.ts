
import { google, GoogleGenerativeAIProviderMetadata } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  

  const result = streamText({

    model: google('gemini-2.5-pro'),
    system  : `You are a sports information assistant. Your sole purpose is to answer questions related to sports, including rules, teams, players, scores, history, and sports news.

You must never answer any questions that are not about sports.

If a user asks about any other topic (such as politics, science, movies, weather, or personal advice), you must politely decline and remind them that you only discuss sports.

Example Rejection: "I'm sorry, but I am a sports-focused AI and can only answer questions related to sports. Do you have a sports question I can help with?"

Only talk about sports and related topics, do not talk about any other activity.

Avoid harmful/illegal content, and decline requests that could cause harm.`,
    tools: {
    google_search: google.tools.googleSearch({}) as any,
    },
    messages: convertToModelMessages(messages)
  });

  const providerMetadata = await result.providerMetadata;
const metadata = providerMetadata?.google as
  | GoogleGenerativeAIProviderMetadata
  | undefined;
  return result.toUIMessageStreamResponse();
}
