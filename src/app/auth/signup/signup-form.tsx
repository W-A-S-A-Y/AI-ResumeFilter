"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

type FormDataType = {
  name: string;
  email: string;
  password: string;
};

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<FormDataType>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { toast } = useToast();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    }).then((res) => res.json());

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    toast({
      title: "Success",
      description: "User has been registered successful 😇",
      duration: 1500,
    });

    setLoading(false);

    router.replace("/auth/login");
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-y-2">
      <h3 className="text-lg font-bold mb-3">SIGNUP</h3>
      <input
        name="name"
        type="text"
        required
        placeholder="Username"
        className="text-sm p-2 rounded-sm bg-transparent border outline-none"
        onChange={handleInputChange}
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="text-sm p-2 rounded-sm bg-transparent border outline-none"
        onChange={handleInputChange}
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        className="text-sm p-2 rounded-sm bg-transparent border outline-none"
        onChange={handleInputChange}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button type="submit">{loading ? <Spinner /> : "Signup"}</Button>
    </form>
  );
}
