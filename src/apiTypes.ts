
export interface MovieSummary {
  id: string;
  title: string;
  releaseDate?: string;
  posterPath?: string;
}

export interface PersonSummary {
  id: string;
  name: string;
  profilePath?: string;
}

export type SearchResult = (MovieSummary & { type: ThingType.Movie}) | (PersonSummary & { type: ThingType.Person});

export interface Movie extends MovieSummary {
  overview: string;
  tagline: string;
  voteAverage: number;
}

export interface MovieWithUserMetadata extends Movie {
  watched: boolean;
  inWatchlist: boolean;
  sentiment: Sentiment
}

export interface MovieCredit {
  id: string;
  person: Pick<Person, 'id' | 'name' | 'profilePath'>;
  jobs: string[];
  characters: string[];
}

export interface Person extends PersonSummary {
  biography: string;
  knownForDepartment?: string;
}

export interface PersonCredit {
  id: string;
  movie: Pick<Movie, 'id' | 'title' | 'posterPath' | 'releaseDate'>;
  jobs: string[];
  characters?: string[];
}

export interface ListSummary {
  id: string;
  name: string;
  type: ListType; // TODO: Migrate user data to ThingType
}

export interface List extends ListSummary {
  items: Movie[] | Person[];
}

export enum Sentiment {
  Disliked = 'DISLIKED',
  Liked = 'LIKED',
  None = 'NONE'
}

export enum ThingType {
  Movie = 'Movie',
  Person = 'Person'
}

export enum ListType {
  Movie = 'MOVIE',
  Person = 'PERSON'
}
