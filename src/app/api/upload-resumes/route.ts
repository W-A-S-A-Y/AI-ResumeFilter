import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const s3Client = new S3Client({
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

  const formData = await req.formData();
  const files = formData.getAll("file");

  if (files.length === 0) return Response.json({ error: "no file found" });

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as unknown as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `${session.id}/${chatId}/${file.name}`,
          ContentType: "application/pdf",
          Body: buffer,
          ACL: "public-read",
        })
      );
    }

    return Response.json({ message: "request successful" });
  } catch (error) {
    console.log(`ERRORRR: ${error}`);
    return Response.json({ message: "request failed", error });
  }
}
