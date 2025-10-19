type SortableMovie = { releaseDate?: string; posterPath?: string }

export function sortMoviesByReleaseDateDesc(movieA: SortableMovie, movieB: SortableMovie) {
  if (movieA.releaseDate && movieB.releaseDate) {
    return new Date(movieA.releaseDate) < new Date(movieB.releaseDate) ? -1 : 1
  } else if (movieA.releaseDate || movieB.releaseDate) {
    return movieA.releaseDate ? -1 : 1
  } else {
    return movieA.posterPath ? -1 : 1
  }
}
