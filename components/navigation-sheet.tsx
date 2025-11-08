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

export const NavigationSheet = () => {
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
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full rounded-full">
              Sign In
            </Button>
            <Button className="w-full rounded-full">Get Started</Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
