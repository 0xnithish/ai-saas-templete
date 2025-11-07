"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ArrowRight, Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationLinks = [
    { href: "/services", label: "Services" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 md:px-8">
        {/* Logo on the left */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="Logo" className="h-6 w-auto sm:h-8" />
        </Link>

        {/* Navigation links in the center - hidden on mobile */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1 md:gap-2">
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA button - hidden on mobile, visible on desktop */}
        <Button asChild size="sm" className="hidden md:inline-flex gap-2">
          <Link href="/get-started">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        {/* Mobile Hamburger Menu - visible only on mobile */}
        <div className="md:hidden relative">
          {/* Hamburger menu trigger */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 relative z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              {/* Backdrop overlay */}
              <div 
                className="fixed inset-0 top-14 sm:top-16 z-40 bg-black/20 animate-in fade-in duration-200"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu dropdown - full width */}
              <div className="fixed left-0 right-0 top-14 sm:top-16 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                <nav className="flex flex-col gap-1 border-b bg-background p-4 shadow-lg">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="w-full px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <div className="mt-3 pt-3 border-t">
                    <Button 
                      asChild 
                      size="sm" 
                      className="w-full gap-2"
                    >
                      <Link href="/get-started" onClick={() => setIsMenuOpen(false)}>
                        Get started
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}