import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-primary text-primary-foreground">
      <div className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-10 text-sm font-medium">
          <Link href="#" className="hover:opacity-80 transition-opacity">
            🎉 New feature available! Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}