import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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

export async function GET(req: NextRequest) {
  //@ts-ignore
  const session: SessionType = await getServerSession(authOptions);

  if (!session)
    return Response.json({ error: "user is not authorized" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chat-id");
  if (!chatId)
    return Response.json({ error: "chat id is not provided" }, { status: 400 });

  try {
    const files = await s3Client
      .send(
        new ListObjectsCommand({
          Bucket: bucketName,
          Prefix: `${session.id}/${chatId}/`,
        })
      )
      .then((res) => res.Contents)
      .catch((error) => console.log(`ERROR: ${error}`));

    if (!files)
      return Response.json({ error: "files not found" }, { status: 400 });

    const resumeLinks: string[] = [];

    for (const file of files) {
      if (file.Key)
        resumeLinks.push(
          `https://resume-insight.s3.amazonaws.com/${file.Key.replace(
            / /g,
            "+"
          )}`
        );
    }
    console.log(resumeLinks);
    return Response.json({ message: "request successful", resumeLinks });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}
