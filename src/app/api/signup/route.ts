import { NextRequest } from "next/server";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import CryptoJS from "crypto-js";
import { faker } from "@faker-js/faker";

type UserDataType = {
  name: string;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const userData: UserDataType = await req.json();

    if (!userData || Object.entries(userData).some((val) => val === null))
      return Response.json(
        { error: "please fill all fields" },
        { status: 400 }
      );

    const user = await db
      .select()
      .from(users)
      .limit(1)
      .where(eq(users.email, userData.email));

    if (user.length > 0)
      return Response.json({ error: "user already exist" }, { status: 400 });

    userData.password = CryptoJS.AES.encrypt(
      userData.password,
      process.env.SECRET_KEY!
    ).toString();

    const image = faker.image.avatarGitHub();

    const newUser = await db.insert(users).values({ ...userData, image });

    return Response.json(
      { message: "request successful", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ message: "request failed", error }, { status: 500 });
  }
}
