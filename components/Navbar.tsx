import Link from "next/link";
import { BookOpen, Library, User, LogIn } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold text-lg tracking-tight">
            StorySpine
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/library"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <Library className="w-4 h-4" />
                <span>Library</span>
              </Link>
              <Link
                href={`/user/${user.id}`}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              <LogIn className="w-4 h-4" />
              <span>Log in</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
