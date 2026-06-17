"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { searchMovie } from "@/lib/server/tmdb";
import { addToWatchlist, WatchlistItem } from "@/lib/server/watchlist";
import { formatDate } from "@/lib/utils";

type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
};

type MovieSearchProps = {
  watchlist: WatchlistItem[];
};

export function MovieSearch({ watchlist }: MovieSearchProps) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (query.length < 3) {
      setMovies([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const results = await searchMovie(query);
      setMovies(results.slice(0, 6));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleAdd = async (movie: Movie) => {
    await addToWatchlist({
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    });
  };

  return (
    <Command className="overflow-hidden rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search movies..."
        value={query}
        onValueChange={setQuery}
        className="h-6 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
      />

      <CommandList>
        {query.length < 3 && (
          <CommandEmpty>Type at least 3 characters</CommandEmpty>
        )}

        {movies.length === 0 && query.length >= 3 && (
          <CommandEmpty>No results</CommandEmpty>
        )}

        <CommandGroup heading="Movies">
          {movies.map((movie) => {
            const watchlistMovieIds = watchlist.map((movie) => movie.tmdb_id);
            const isInWatchlist = watchlistMovieIds.includes(movie.id);
            return (
              <CommandItem
                key={movie.id}
                value={`${movie.id}-${movie.title}`}
                className="flex items-center gap-3"
              >
                {movie.poster_path && (
                  <div className="relative h-[40px] w-[30px] overflow-hidden rounded">
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="font-medium">{movie.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {movie.release_date
                      ? formatDate(movie.release_date)
                      : "No date"}
                  </span>
                </div>

                <Button
                  size="sm"
                  className="ml-auto"
                  disabled={isInWatchlist}
                  onClick={() => {
                    if (!isInWatchlist) {
                      handleAdd(movie); // Twoja pierwsza funkcja
                    }
                  }}
                >
                  {isInWatchlist ? "On the list" : "Add"}
                </Button>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
