export interface Person {
  id: number;
  name: string;
  biography: string;
  known_for_department: string;
  profile_path: string;
}

export interface FavouritablePerson extends Person {
  favourited: boolean;
}

export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  vote_average: number;
  release_date: string;
  overview: string;
  tagline: string;
}

export interface LikableMovie extends Movie {
  watched: boolean;
  inWatchlist: boolean;
  sentiment?: Sentiment;
}

export enum Sentiment {
  NONE = 'none', LIKED = 'liked', DISLIKED = 'disliked'
}

export interface MovieCreditForPerson extends LikableMovie {
  jobs: string[];
}

export interface PersonCreditForMovie {
  id: number; // Person ID
  name: string;
  profile_path: string;
  jobs: string[];
}
