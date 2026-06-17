"use server";

type SearchMovieResult = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
};

export async function searchMovie(query: string) {
  if (!query.trim()) {
    return [];
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&language=pl-PL`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
      next: {
        revalidate: 60,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Błąd podczas pobierania danych z TMDB");
  }

  const data = await response.json();

  return data.results.map((movie: SearchMovieResult) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
  }));
}