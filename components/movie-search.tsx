"use client";

import { useEffect, useRef, useState } from "react";
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
import { X } from "lucide-react";

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
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setMovies([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAdd = async (movie: Movie) => {
    await addToWatchlist({
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    });
  };

  return (
    <div ref={wrapperRef}>
      <Command className="overflow-hidden rounded-lg border shadow-md">
        <div className="relative">
          <CommandInput
            placeholder="Search movies..."
            value={query}
            onValueChange={setQuery}
            className="px-2 h-6 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setMovies([]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

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
                  className="flex items-center gap-3 w-full min-w-0"
                >
                  {movie.poster_path && (
                    <div className="relative h-[40px] w-[30px] flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span className="font-medium break-words">
                      {movie.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {movie.release_date
                        ? formatDate(movie.release_date)
                        : "No date"}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="ml-auto flex-shrink-0"
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
    </div>
  );
}
