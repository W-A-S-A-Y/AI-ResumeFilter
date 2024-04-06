"use client";

import ThemeSwitcher from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { Righteous } from "next/font/google";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });

export default function Navbar() {
  const { data } = useSession();

  return (
    <nav className="border-b h-[9vh] flex justify-between items-center px-4">
      <h1 className={cn(righteous.className, "text-xl")}>Resume Insight</h1>
      <div className="flex gap-x-2 items-center">
        <ThemeSwitcher />
        {data?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-[2rem] w-[2rem]">
                <AvatarImage src={data.user.image ?? ""} alt="@shadcn" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem
                className="bg-red-600"
                onClick={() => signOut()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </nav>
  );
}
