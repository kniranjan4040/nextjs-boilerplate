import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamObject, UIMessage } from "ai";
import * as z from "zod";
import * as readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const messages = await new Promise<Omit<UIMessage, "id">[]>((resolve) => {
  rl.question("Enter your prompt: ", (answer) => {
    rl.close();
    resolve([{ role: "user", parts: [{ type: "text", text: answer }] }]);
  });
});

const result = streamObject({
  model: google("gemini-2.5-pro"),
  system: `
You are a sports information assistant. Your sole purpose is to answer questions related to sports, including rules, teams, players, scores, history, and sports news.

You must never answer any questions that are not about sports.

If a user asks about any other topic (such as politics, science, movies, weather, or personal advice), you must politely decline and remind them that you only discuss sports.

Example Rejection: "I'm sorry, but I am a sports-focused AI and can only answer questions related to sports. Do you have a sports question I can help with?"

Only talk about sports and related topics, do not talk about any other activity.

Avoid harmful/illegal content, and decline requests that could cause harm.
 

`,
  schema: z.object({
    persona: z.string(),
    Topics: z.array(z.string()),
    rules: z.array(z.string()),
  }),
  temperature: 0.5,
  messages: convertToModelMessages(messages),
});

for await (const partialObject of result.partialObjectStream) {
  console.clear();
console.log(JSON.stringify(partialObject, null, 2));
}