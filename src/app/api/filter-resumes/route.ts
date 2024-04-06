import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { Document } from "@langchain/core/documents";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 1.5,
});

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

const textSplitter = new RecursiveCharacterTextSplitter();

const prompt = ChatPromptTemplate.fromTemplate(
  `Answer the following question based only on the provided context:

<context>
{context}
</context>

Question: {input}`
);

const s3client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: "us-east-1",
});

const bucketName = "resume-insight";

type SessionType = {
  id: string;
  email: string;
};

export async function POST(req: NextRequest) {
  //@ts-ignore
  const session: SessionType = await getServerSession(authOptions);

  if (!session)
    return Response.json({ error: "user is not authorized" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chat-id");
  if (!chatId)
    return Response.json({ error: "chat id is not provided" }, { status: 400 });

  const reqData = await req.json();

  if (!reqData.prompt)
    return Response.json({ message: "prompt is empty" }, { status: 400 });

  try {
    const response = await s3client.send(
      new ListObjectsCommand({
        Bucket: bucketName,
        Prefix: `${session.id}/${chatId}/`,
      })
    );
    const files = response.Contents;
    if (!files) return Response.json({ message: "there are no files" });

    var pdfBlobs: Blob[] = [];

    for (const file of files) {
      const fileName = file.Key?.replace(/ /g, "+");
      const blob = await fetch(
        `https://resume-insight.s3.amazonaws.com/${fileName}`
      ).then((res) => res.blob());

      pdfBlobs.push(blob);
    }

    const loaders = pdfBlobs.map((blob) => new WebPDFLoader(blob));

    var docs: Document<Record<string, any>>[] = [];

    for (const loader of loaders) {
      const tempDocs = await loader.load();
      for (const doc of tempDocs) {
        docs.push(doc);
      }
    }

    const splitDocs = await textSplitter.splitDocuments(docs);

    const vectorstore = await PineconeStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        pineconeIndex,
        maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      }
    );

    const documentChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
    });

    const retriever = vectorstore.asRetriever();

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });

    const result = await retrievalChain.invoke({
      input: reqData.prompt,
    });

    console.log(result.answer);

    return Response.json(
      {
        message: "request successful",
        answer: result.answer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return Response.json({ message: "request failed", error });
  }
}
