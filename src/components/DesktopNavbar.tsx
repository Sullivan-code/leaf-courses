"use client";

import { 
  BellIcon, 
  HomeIcon, 
  UserIcon, 
  InfoIcon,
  ShoppingCartIcon,
  BookOpenIcon,
  CalendarIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useCartStore } from "../../store/cart-store";

function DesktopNavbar() {
  const { isSignedIn, user } = useUser();
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="hidden md:flex items-center space-x-4">
      
      <Link href="/">
        <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Button>
      </Link>

      <Link href="/nossos-cursos">
        <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800">
          <BookOpenIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Nossos Cursos</span>
        </Button>
      </Link>

      {/* 🔥 NOVO BOTÃO */}
      {isSignedIn && (
        <Link href="/meus-cursos">
          <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 hover:from-emerald-600 hover:to-green-800">
            <BookOpenIcon className="w-4 h-4" />
            <span className="hidden lg:inline">Meus Cursos</span>
          </Button>
        </Link>
      )}

      <Link href="/quem-somos">
        <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800">
          <InfoIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Quem Somos</span>
        </Button>
      </Link>

      <Link href="/depoimentos">
        <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800">
          <CalendarIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Depoimentos</span>
        </Button>
      </Link>

      {isSignedIn ? (
        <>
          <Link href="/notifications">
            <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notificações</span>
            </Button>
          </Link>

{/*
<Link href="/checkout">
  <Button className="relative flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800">
    <ShoppingCartIcon className="w-4 h-4" />
    <span className="hidden lg:inline">Checkout</span>

    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 flex h-6 min-w-[24px] px-1 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
        {cartCount}
      </span>
    )}
  </Button>
</Link>
*/}

          <Link
            href={`/profile/${
              user?.username ??
              user?.emailAddresses[0]?.emailAddress.split("@")[0]
            }`}
          >
            <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 hover:from-purple-600 hover:to-purple-800">
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Perfil</span>
            </Button>
          </Link>

          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:from-purple-600 hover:to-purple-800">
            Entrar
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DesktopNavbar;