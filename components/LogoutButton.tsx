"use client";

import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Log out</span>
    </button>
  );
}
