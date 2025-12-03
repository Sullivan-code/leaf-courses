"use client";

import {
  BellIcon,
  HomeIcon,
  UserIcon,
  BookOpenIcon,
  CalendarIcon,
  MessageCircleIcon,
  InfoIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

function DesktopNavbar() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link href="/">
        <Button
          className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
        >
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Button>
      </Link>

      <Link href="/nossos-cursos">
        <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow">
          <BookOpenIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Nossos Cursos</span>
        </Button>
      </Link>

      <Link href="/quem-somos">
        <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow">
          <InfoIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Quem Somos</span>
        </Button>
      </Link>

      <Link href="/depoimentos">
        <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow">
          <CalendarIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Depoimentos</span>
        </Button>
      </Link>

      <Link href="/fale-conosco">
        <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow">
          <MessageCircleIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Fale Conosco</span>
        </Button>
      </Link>

      {isSignedIn ? (
        <>
          <Link href="/notifications">
            <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notificações</span>
            </Button>
          </Link>

          <Link
            href={`/profile/${
              user?.username ??
              user?.emailAddresses[0]?.emailAddress.split("@")[0]
            }`}
          >
            <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow">
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Perfil</span>
            </Button>
          </Link>

          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow">
            Entrar
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DesktopNavbar;
