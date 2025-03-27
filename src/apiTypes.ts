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
  imdbId: string;
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
  castOrder?: number;
}

export interface Person extends PersonSummary {
  biography: string;
  knownForDepartment?: string;
}

export interface PersonCredit {
  id: string;
  movie: MovieSummary;
  jobs: string[];
  characters: string[];
}

export interface ListSummary {
  id: string;
  name: string;
  type: ListType; // TODO: Migrate user data to ThingType
  size: number;
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

export type Tomatometer = {
  consensus?: string;
  link: string;
  score: number;
  state: TomatometerState;
};

export enum TomatometerState {
  CertifiedFresh = 'CERTIFIED_FRESH',
  Fresh = 'FRESH',
  Rotten = 'ROTTEN'
}

export interface UserSettings {
  streaming?: {
    providers?: string[];
    region?: string;
  }
}

export interface Provider {
  id: string;
  logo: string;
  name: string;
}

export interface User {
  username: string;
  avatarUrl: string;
  isAdmin?: boolean;
  public?: boolean;
}

export interface UserWithStats extends User {
  stats: {
    favouritePeople: number;
    watched: number;
    moviesLiked: number;
    watchlist: number;
  };
}
