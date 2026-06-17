"use client";

import Image from "next/image";
import { formatDate, getDaysUntilRelease } from "@/lib/utils";

type Movie = {
  id: string;
  title: string;
  poster_path: string | null;
  release_date: string;
};

export function WatchlistList({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid gap-4">
      {movies.map((movie) => {
        const daysUntilRelease = movie.release_date
          ? getDaysUntilRelease(movie.release_date)
          : null;
        
        return (
          <div key={movie.id} className="flex flex-col md:flex-row gap-4 border p-3 rounded-lg">
            {movie.poster_path && (
              <div className="relative h-[120px] w-[80px] overflow-hidden rounded">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <h2 className="font-medium">{movie.title}</h2>

              <p className="text-sm text-muted-foreground">
                {movie.release_date
                  ? formatDate(movie.release_date)
                  : "Brak danych"}
              </p>
            </div>
            <div className="self-center ml-auto text-right flex-shrink-0 pl-2">
              {movie.release_date &&
                daysUntilRelease !== null &&
                (daysUntilRelease > 0 ? (
                  <p className="text-sm text-amber-500">
                    Premiere: {daysUntilRelease} days left
                  </p>
                ) : (
                  <p className="text-sm text-green-500">Available</p>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
