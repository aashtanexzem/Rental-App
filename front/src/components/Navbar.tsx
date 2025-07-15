"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";


const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-background text-foreground shadow-md"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 md:px-10 bg-black">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger/>
            </div>
          ) }
        <Link href="/" scroll={false} className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Rentiful Logo" width={28} height={28} />
          <h1 className="text-xl font-bold tracking-tight text-white">
            RENT
            <span className="text-pink-500 font-light hover:text-pink-800">
              IFUL
            </span>
          </h1>
        </Link>
        {isDashboardPage && authUser && (
          <Button
            variant="secondary"
            className="md:ml-4 bg-slate-50 text-slate-900 hover:bg-red-500 hover:text-slate-50"
            onClick={() => {
              router.push(
                authUser.userRole?.toLowerCase() === "manager"
                  ? "/managers/newproperty"
                  : "/search"
              );
            }}
          >
            {authUser.userRole?.toLowerCase() === "manager" ? (
              <>
                <Plus className="h-4 w-4" />
                <span className="hidden md:block ml-2">Add New Property</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span className="hidden md:block ml-2 ">
                  Search Properties.
                </span>
              </>
            )}
          </Button>
        )}
  </div>

        {!isDashboardPage && !authUser && (
          <p className="text-md hidden lg:flex justify-center flex-1 text-white ">
            Discover your perfect rental apartment with our advanced search
          </p>
        )}

        <div className="flex items-center gap-5">
   {authUser ? (
  <>
    <div className="relative hidden md:block">
      <div className="relative">
        <MessageCircle className="w-6 h-6 cursor-pointer text-slate-200 hover:text-slate-400" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-700 rounded-full" />
      </div>
    </div>

    <div className="relative md:block hidden">
      <Bell className="w-6 h-6 cursor-pointer text-slate-200 hover:text-slate-400" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-700 rounded-full" />
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar>
            <AvatarImage src={authUser.userInfo?.image} />
            <AvatarFallback className="bg-slate-400">
              {authUser.userRole?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-slate-200 hidden md:block">
            {authUser.userInfo?.name}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white text-slate-700">
        <DropdownMenuItem
          className="cursor-pointer hover:!bg-slate-400 hover:text-slate-100 font-bold"
          onClick={() => {
            router.push(
              authUser.userRole?.toLowerCase() === "manager"
                ? "/managers/properties"
                : "/tenants/favorites",
              { scroll: false }
            );
          }}
        >
          Go to Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200"/>
        <DropdownMenuItem
          className="cursor-pointer hover:!bg-slate-400 hover:text-white "
         onClick={() => 
          router.push(
           `/${authUser.userRole?.toLowerCase()}s/settings`,
           { scroll: false }
          )
         }
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:!bg-slate-400 hover:text-white "
         onClick={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
) : (
  <>
    <Link href="/signin">
      <Button
        variant="outline"
        className="text-white border-white bg-transparent hover:bg-white hover:text-sm rounded-lg"
      >
        Sign In
      </Button>
    </Link>
    <Link href="/signup">
      <Button
        variant="outline"
        className="text-white bg-red-600 hover:bg-white hover:text-slate-950 rounded-lg"
      >
        Sign Up
      </Button>
    </Link>
  </>
)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;