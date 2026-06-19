"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToWatchlist(movie: {
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("watchlist").insert({
    user_id: user.id,
    tmdb_id: movie.tmdb_id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
  });

  if (error) throw error;

  revalidatePath("/watchlist");
  return { success: true };
}

export type WatchlistItem = {
  id: string;
  user_id: string;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  created_at: string;
};

export async function getUserWatchlist(): Promise<WatchlistItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
  .from("watchlist")
  .select("*")
  .eq("user_id", user.id);

if (data) {
  const today = new Date();

  data.sort((a, b) => {
    const aDate = new Date(a.release_date);
    const bDate = new Date(b.release_date);

    const aExpired =
      today.getTime() - aDate.getTime() > 10 * 24 * 60 * 60 * 1000;

    const bExpired =
      today.getTime() - bDate.getTime() > 10 * 24 * 60 * 60 * 1000;

  
    if (aExpired !== bExpired) {
      return aExpired ? 1 : -1;
    }

  
    return aDate.getTime() - bDate.getTime();
  });
}

  if (error) throw error;

  return data as WatchlistItem[];
}
