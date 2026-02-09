import { supabase } from "@/lib/supabase"

export async function getUserProfilePage(userId: string) {
  const [
    profile,
    genres,
    currentlyReading,
    recentlyFinished,
    recentReviews,
  ] = await Promise.all([
    supabase.rpc("get_user_profile", { p_user_id: userId }),
    supabase.rpc("get_user_genres", { p_user_id: userId }),
    supabase.rpc("get_user_currently_reading", { p_user_id: userId }),
    supabase.rpc("get_user_recently_finished", { p_user_id: userId }),
    supabase.rpc("get_user_recent_reviews", { p_user_id: userId }),
  ])

  if (
    profile.error ||
    genres.error ||
    currentlyReading.error ||
    recentlyFinished.error ||
    recentReviews.error
  ) {
    throw new Error("Failed to load profile")
  }

  return {
    profile: profile.data?.[0],
    genres: genres.data,
    currentlyReading: currentlyReading.data,
    recentlyFinished: recentlyFinished.data,
    recentReviews: recentReviews.data,
  }
}

export async function updateUserProfile(
  fields: {
    displayName?: string
    bio?: string
    avatarUrl?: string
  }
) {
  const { error } = await supabase
    .from("users")
    .update({
      display_name: fields.displayName,
      bio: fields.bio,
      avatar_url: fields.avatarUrl,
    })
    .eq("id", (await supabase.auth.getUser()).data.user?.id)

  if (error) throw error
}
