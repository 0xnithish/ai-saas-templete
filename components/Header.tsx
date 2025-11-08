import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import NavigationSheet from "@/components/NavigationSheet";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <SignedOut>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <SignInButton />
            </Button>
            <Button asChild>
              <SignUpButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

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
