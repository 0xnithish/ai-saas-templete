"use client";

"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import NavMenu from "@/components/navigation/NavMenu";
import NavigationSheet from "@/components/navigation/NavigationSheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ArrowRight } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const { openSignIn, openSignUp } = useClerk();
  const { isLoaded } = useUser();

  const handleSignIn = () => {
    openSignIn({});
  };

  const handleSignUp = () => {
    openSignUp({});
  };

  return (
    <nav className="sticky top-0 z-50 h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!isLoaded ? (
            // Show skeleton buttons while loading to prevent layout shift
            <div className="flex items-center gap-3">
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md hidden sm:inline-flex" />
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            </div>
          ) : (
            <>
              <SignedOut>
                <Button variant="outline" className="hidden sm:inline-flex" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button onClick={handleSignUp}>
                  Sign Up
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild variant="outline">
                  <SignOutButton />
                </Button>
                <Button asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </SignedIn>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
