"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import NavMenu from "@/components/navigation/NavMenu";
import NavigationSheet from "@/components/navigation/NavigationSheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ArrowRight } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useSessionOptimized } from "@/components/auth/SessionProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { session, isLoading } = useSessionOptimized();
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isLoading ? (
            // Show skeleton buttons while loading to prevent layout shift
            <div className="flex items-center gap-3">
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md hidden sm:inline-flex" />
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            </div>
          ) : (
            <>
              {!user ? (
                <>
                  <Button asChild variant="outline" className="hidden sm:inline-flex">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                  <Button asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
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
