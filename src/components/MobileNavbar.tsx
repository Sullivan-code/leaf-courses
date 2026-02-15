"use client";

import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  BookOpenIcon,
  CalendarIcon,
  MessageCircleIcon,
  InfoIcon,
  ShoppingCartIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useState } from "react";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useCartStore } from "../../store/cart-store";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn, user } = useUser();
  const { items } = useCartStore();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-lg font-bold text-purple-700">
              Menu
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-4 mt-6">

            <Link href="/">
              <Button className="flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                <HomeIcon className="w-4 h-4" />
                Home
              </Button>
            </Link>

            <Link href="/nossos-cursos">
              <Button className="flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                <BookOpenIcon className="w-4 h-4" />
                Nossos Cursos
              </Button>
            </Link>

            <Link href="/quem-somos">
              <Button className="flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                <InfoIcon className="w-4 h-4" />
                Quem Somos
              </Button>
            </Link>

            <Link href="/depoimentos">
              <Button className="flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                <CalendarIcon className="w-4 h-4" />
                Depoimentos
              </Button>
            </Link>

            <Link href="/fale-conosco">
              <Button className="flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                <MessageCircleIcon className="w-4 h-4" />
                Fale Conosco
              </Button>
            </Link>

            {isSignedIn ? (
              <>
                <Link href="/notifications">
                  <Button className="flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                    <BellIcon className="w-4 h-4" />
                    Notificações
                  </Button>
                </Link>

                {/* Checkout */}
                <Link href="/checkout">
                  <Button className="relative flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                    
                    <ShoppingCartIcon className="w-4 h-4" />
                    Checkout

                    {cartCount > 0 && (
                      <span className="absolute right-3 flex h-6 min-w-[24px] px-2 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <Link
                  href={`/profile/${
                    user?.username ??
                    user?.emailAddresses[0]?.emailAddress.split("@")[0]
                  }`}
                >
                  <Button className="flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-blue-400 to-purple-500 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                    <UserIcon className="w-4 h-4" />
                    Perfil
                  </Button>
                </Link>

                <SignOutButton>
                  <Button className="flex items-center gap-3 justify-start w-full text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-pink-500 hover:to-red-600 transition-all duration-300">
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button className="w-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
                  Entrar
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
