"use client";

import Image from "next/image";
import { formatDate, getDaysUntilRelease } from "@/lib/utils";
import { Trash } from "lucide-react";
import { removeFromWatchlist } from "@/lib/server/watchlist";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
type Movie = {
  id: string;
  title: string;
  poster_path: string | null;
  release_date: string;
};

const handleDelete = async (id: string) => {
  await removeFromWatchlist(id);
};

export function WatchlistList({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid gap-4">
      {movies.map((movie) => {
        const daysUntilRelease = movie.release_date
          ? getDaysUntilRelease(movie.release_date)
          : null;

        return (
          <div
            key={movie.id}
            className="flex flex-col items-center md:flex-row gap-4 border p-3 rounded-lg"
          >
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

            <div className="flex flex-col flex-1 gap-2">
              <h2 className="font-medium">{movie.title}</h2>

              <p className="text-sm text-muted-foreground">
                {movie.release_date
                  ? formatDate(movie.release_date)
                  : "Brak danych"}
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash className="text-red-700 size-4 cursor-pointer" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete movie from yours watchlist.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(movie.id)}>
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="self-center ml-auto text-right flex-shrink-0 pl-2">
              {movie.release_date &&
                daysUntilRelease !== null &&
                (daysUntilRelease > 0 ? (
                  <p className="text-sm text-amber-500">
                    Premiere: {daysUntilRelease} days left
                  </p>
                ) : (
                  <p className="text-sm  text-green-500">Available</p>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
