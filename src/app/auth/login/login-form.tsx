"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

type FormDataType = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<FormDataType>({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    const res = await signIn("credentials", { ...formData, redirect: false });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    setLoading(false);

    router.replace("/chat");
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-y-2">
      <h3 className="text-lg font-bold mb-3">LOGIN</h3>
      <input
        type="email"
        required
        placeholder="Email"
        className="text-sm p-2 rounded-sm bg-transparent border outline-none"
        onChange={handleInputChange}
      />
      <input
        type="password"
        required
        placeholder="Password"
        className="text-sm p-2 rounded-sm bg-transparent border outline-none"
        onChange={handleInputChange}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button type="submit">{loading ? <Spinner /> : "Login"}</Button>
      <span className="text-xs text-right">
        Do not have an account?{" "}
        <Link href={"/auth/signup"} className="underline">
          Signup
        </Link>
      </span>
    </form>
  );
}
