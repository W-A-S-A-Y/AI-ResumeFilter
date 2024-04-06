import { ChatOpenAI } from "@langchain/openai";
import { NextRequest } from "next/server";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatModel = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

const prompt =
  ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

<context>
{context}
</context>

Question: {input}`);

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  return Response.json({ message: "hello world" });
}
