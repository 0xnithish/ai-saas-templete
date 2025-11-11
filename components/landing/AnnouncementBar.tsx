import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-primary text-primary-foreground">
      <div className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-10 text-sm font-medium">
          <Link href="https://github.com" className="hover:opacity-80 transition-opacity">
            🚀 Now v2.0 with AI integrations! Clone now →
          </Link>
        </div>
      </div>
    </div>
  );
}