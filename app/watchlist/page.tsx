import { MovieSearch } from "@/components/movie-search";
import { WatchlistList } from "@/components/watchlist-list";
import { getUserWatchlist } from "@/lib/server/watchlist";

export default async function WatchlistPage() {
  const watchlist = await getUserWatchlist();

  return (
    <div className="flex-1 flex flex-col gap-8">
      <MovieSearch watchlist={watchlist} />
      <WatchlistList movies={watchlist} />
    </div>
  );
}