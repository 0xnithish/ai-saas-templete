import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

const NavigationSheet = () => {
  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-lg font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
            <SignedOut>
              <Button asChild variant="outline" className="w-full rounded-full">
                <SignInButton />
              </Button>
              <Button asChild className="w-full rounded-full">
                <SignUpButton />
              </Button>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-lg font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationSheet;
