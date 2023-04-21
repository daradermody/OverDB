import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CastCredit = Person & {
  __typename?: 'CastCredit';
  character: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  order: Scalars['Int'];
  profilePath?: Maybe<Scalars['String']>;
};

export type CrewCredit = Person & {
  __typename?: 'CrewCredit';
  id: Scalars['ID'];
  jobs: Array<Scalars['String']>;
  name: Scalars['String'];
  profilePath?: Maybe<Scalars['String']>;
};

export type Movie = {
  __typename?: 'Movie';
  id: Scalars['ID'];
  inWatchlist: Scalars['Boolean'];
  overview: Scalars['String'];
  posterPath?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['String']>;
  sentiment: Sentiment;
  tagline: Scalars['String'];
  title: Scalars['String'];
  tomatometer?: Maybe<Tomatometer>;
  voteAverage: Scalars['Float'];
  watched: Scalars['Boolean'];
};

export type MovieCredit = {
  __typename?: 'MovieCredit';
  character?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inWatchlist: Scalars['Boolean'];
  jobs: Array<Scalars['String']>;
  posterPath?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['String']>;
  sentiment: Sentiment;
  title: Scalars['String'];
  watched: Scalars['Boolean'];
};

export type MovieInfo = {
  __typename?: 'MovieInfo';
  id: Scalars['ID'];
  overview: Scalars['String'];
  posterPath?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['String']>;
  tagline: Scalars['String'];
  title: Scalars['String'];
  tomatometer?: Maybe<Tomatometer>;
  voteAverage: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  setFavourite: PersonInfo;
  setInWatchlist: Movie;
  setSentiment: Movie;
  setWatched: Movie;
};


export type MutationSetFavouriteArgs = {
  favourited: Scalars['Boolean'];
  id: Scalars['ID'];
};


export type MutationSetInWatchlistArgs = {
  id: Scalars['ID'];
  inWatchlist: Scalars['Boolean'];
};


export type MutationSetSentimentArgs = {
  id: Scalars['ID'];
  sentiment: Sentiment;
};


export type MutationSetWatchedArgs = {
  id: Scalars['ID'];
  watched: Scalars['Boolean'];
};

export type PaginatedMovies = {
  __typename?: 'PaginatedMovies';
  endReached: Scalars['Boolean'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  results: Array<Movie>;
};

export type Person = {
  id: Scalars['ID'];
  name: Scalars['String'];
  profilePath?: Maybe<Scalars['String']>;
};

export type PersonInfo = Person & {
  __typename?: 'PersonInfo';
  biography?: Maybe<Scalars['String']>;
  favourited: Scalars['Boolean'];
  id: Scalars['ID'];
  knownForDepartment?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  profilePath?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  castForMovie: Array<CastCredit>;
  creditsForPerson: Array<MovieCredit>;
  crewForMovie: Array<CrewCredit>;
  movie: Movie;
  person: PersonInfo;
  recommendedMovies: Array<Movie>;
  search: Array<SearchResult>;
  trending: Array<MovieInfo>;
  upcoming: Array<Movie>;
  user: User;
};


export type QueryCastForMovieArgs = {
  id: Scalars['ID'];
};


export type QueryCreditsForPersonArgs = {
  id: Scalars['ID'];
};


export type QueryCrewForMovieArgs = {
  id: Scalars['ID'];
};


export type QueryMovieArgs = {
  id: Scalars['ID'];
};


export type QueryPersonArgs = {
  id: Scalars['ID'];
};


export type QueryRecommendedMoviesArgs = {
  size?: InputMaybe<Scalars['Int']>;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryTrendingArgs = {
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  username: Scalars['String'];
};

export type SearchResult = Movie | PersonInfo;

export enum Sentiment {
  Disliked = 'DISLIKED',
  Liked = 'LIKED',
  None = 'NONE'
}

export type Stats = {
  __typename?: 'Stats';
  favouritePeople: Scalars['Int'];
  moviesLiked: Scalars['Int'];
  watched: Scalars['Int'];
  watchlist: Scalars['Int'];
};

export type Tomatometer = {
  __typename?: 'Tomatometer';
  consensus?: Maybe<Scalars['String']>;
  link: Scalars['String'];
  score: Scalars['Int'];
  state: TomatometerState;
};

export enum TomatometerState {
  CertifiedFresh = 'CERTIFIED_FRESH',
  Fresh = 'FRESH',
  Rotten = 'ROTTEN'
}

export type User = {
  __typename?: 'User';
  avatarUrl: Scalars['String'];
  favouritePeople: Array<PersonInfo>;
  likedMovies: Array<Movie>;
  stats: Stats;
  username: Scalars['String'];
  watched: PaginatedMovies;
  watchlist: Array<Movie>;
};


export type UserWatchedArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export const GetFavouritePeopleDocument = gql`
    query GetFavouritePeople($username: String!) {
  user(username: $username) {
    favouritePeople {
      id
      profilePath
      name
    }
  }
}
    `;

/**
 * __useGetFavouritePeopleQuery__
 *
 * To run a query within a React component, call `useGetFavouritePeopleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFavouritePeopleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFavouritePeopleQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetFavouritePeopleQuery(baseOptions: Apollo.QueryHookOptions<GetFavouritePeopleQuery, GetFavouritePeopleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFavouritePeopleQuery, GetFavouritePeopleQueryVariables>(GetFavouritePeopleDocument, options);
      }
export function useGetFavouritePeopleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFavouritePeopleQuery, GetFavouritePeopleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFavouritePeopleQuery, GetFavouritePeopleQueryVariables>(GetFavouritePeopleDocument, options);
        }
export type GetFavouritePeopleQueryHookResult = ReturnType<typeof useGetFavouritePeopleQuery>;
export type GetFavouritePeopleLazyQueryHookResult = ReturnType<typeof useGetFavouritePeopleLazyQuery>;
export type GetFavouritePeopleQueryResult = Apollo.QueryResult<GetFavouritePeopleQuery, GetFavouritePeopleQueryVariables>;
export const GetLikedMoviesDocument = gql`
    query GetLikedMovies($username: String!) {
  user(username: $username) {
    likedMovies {
      id
      title
      posterPath
      releaseDate
    }
  }
}
    `;

/**
 * __useGetLikedMoviesQuery__
 *
 * To run a query within a React component, call `useGetLikedMoviesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLikedMoviesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLikedMoviesQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetLikedMoviesQuery(baseOptions: Apollo.QueryHookOptions<GetLikedMoviesQuery, GetLikedMoviesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLikedMoviesQuery, GetLikedMoviesQueryVariables>(GetLikedMoviesDocument, options);
      }
export function useGetLikedMoviesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLikedMoviesQuery, GetLikedMoviesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLikedMoviesQuery, GetLikedMoviesQueryVariables>(GetLikedMoviesDocument, options);
        }
export type GetLikedMoviesQueryHookResult = ReturnType<typeof useGetLikedMoviesQuery>;
export type GetLikedMoviesLazyQueryHookResult = ReturnType<typeof useGetLikedMoviesLazyQuery>;
export type GetLikedMoviesQueryResult = Apollo.QueryResult<GetLikedMoviesQuery, GetLikedMoviesQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($username: String!) {
  user(username: $username) {
    avatarUrl
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUserStatsDocument = gql`
    query GetUserStats($username: String!) {
  user(username: $username) {
    stats {
      favouritePeople
      watched
      moviesLiked
      watchlist
    }
  }
}
    `;

/**
 * __useGetUserStatsQuery__
 *
 * To run a query within a React component, call `useGetUserStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserStatsQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserStatsQuery(baseOptions: Apollo.QueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
      }
export function useGetUserStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
        }
export type GetUserStatsQueryHookResult = ReturnType<typeof useGetUserStatsQuery>;
export type GetUserStatsLazyQueryHookResult = ReturnType<typeof useGetUserStatsLazyQuery>;
export type GetUserStatsQueryResult = Apollo.QueryResult<GetUserStatsQuery, GetUserStatsQueryVariables>;
export const GetWatchedMoviesDocument = gql`
    query GetWatchedMovies($username: String!, $offset: Int, $limit: Int) {
  user(username: $username) {
    watched(offset: $offset, limit: $limit) {
      endReached
      results {
        id
        title
        posterPath
        releaseDate
        watched
        inWatchlist
        sentiment
      }
    }
  }
}
    `;

/**
 * __useGetWatchedMoviesQuery__
 *
 * To run a query within a React component, call `useGetWatchedMoviesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWatchedMoviesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWatchedMoviesQuery({
 *   variables: {
 *      username: // value for 'username'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetWatchedMoviesQuery(baseOptions: Apollo.QueryHookOptions<GetWatchedMoviesQuery, GetWatchedMoviesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWatchedMoviesQuery, GetWatchedMoviesQueryVariables>(GetWatchedMoviesDocument, options);
      }
export function useGetWatchedMoviesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWatchedMoviesQuery, GetWatchedMoviesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWatchedMoviesQuery, GetWatchedMoviesQueryVariables>(GetWatchedMoviesDocument, options);
        }
export type GetWatchedMoviesQueryHookResult = ReturnType<typeof useGetWatchedMoviesQuery>;
export type GetWatchedMoviesLazyQueryHookResult = ReturnType<typeof useGetWatchedMoviesLazyQuery>;
export type GetWatchedMoviesQueryResult = Apollo.QueryResult<GetWatchedMoviesQuery, GetWatchedMoviesQueryVariables>;
export const SearchDocument = gql`
    query Search($query: String!) {
  search(query: $query) {
    ... on Movie {
      id
      title
      posterPath
      releaseDate
    }
    ... on PersonInfo {
      id
      name
      profilePath
    }
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const GetTrendingMoviesDocument = gql`
    query GetTrendingMovies($size: Int!) {
  trending(size: $size) {
    id
    title
    posterPath
    releaseDate
  }
}
    `;

/**
 * __useGetTrendingMoviesQuery__
 *
 * To run a query within a React component, call `useGetTrendingMoviesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrendingMoviesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrendingMoviesQuery({
 *   variables: {
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetTrendingMoviesQuery(baseOptions: Apollo.QueryHookOptions<GetTrendingMoviesQuery, GetTrendingMoviesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrendingMoviesQuery, GetTrendingMoviesQueryVariables>(GetTrendingMoviesDocument, options);
      }
export function useGetTrendingMoviesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrendingMoviesQuery, GetTrendingMoviesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrendingMoviesQuery, GetTrendingMoviesQueryVariables>(GetTrendingMoviesDocument, options);
        }
export type GetTrendingMoviesQueryHookResult = ReturnType<typeof useGetTrendingMoviesQuery>;
export type GetTrendingMoviesLazyQueryHookResult = ReturnType<typeof useGetTrendingMoviesLazyQuery>;
export type GetTrendingMoviesQueryResult = Apollo.QueryResult<GetTrendingMoviesQuery, GetTrendingMoviesQueryVariables>;
export const GetRecommendedMoviesDocument = gql`
    query GetRecommendedMovies($size: Int!) {
  recommendedMovies(size: $size) {
    id
    posterPath
    title
    releaseDate
    watched
    inWatchlist
    sentiment
  }
}
    `;

/**
 * __useGetRecommendedMoviesQuery__
 *
 * To run a query within a React component, call `useGetRecommendedMoviesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecommendedMoviesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecommendedMoviesQuery({
 *   variables: {
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetRecommendedMoviesQuery(baseOptions: Apollo.QueryHookOptions<GetRecommendedMoviesQuery, GetRecommendedMoviesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecommendedMoviesQuery, GetRecommendedMoviesQueryVariables>(GetRecommendedMoviesDocument, options);
      }
export function useGetRecommendedMoviesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecommendedMoviesQuery, GetRecommendedMoviesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecommendedMoviesQuery, GetRecommendedMoviesQueryVariables>(GetRecommendedMoviesDocument, options);
        }
export type GetRecommendedMoviesQueryHookResult = ReturnType<typeof useGetRecommendedMoviesQuery>;
export type GetRecommendedMoviesLazyQueryHookResult = ReturnType<typeof useGetRecommendedMoviesLazyQuery>;
export type GetRecommendedMoviesQueryResult = Apollo.QueryResult<GetRecommendedMoviesQuery, GetRecommendedMoviesQueryVariables>;
export const GetMovieInfoDocument = gql`
    query GetMovieInfo($id: ID!) {
  movie(id: $id) {
    id
    title
    tagline
    overview
    voteAverage
    posterPath
    releaseDate
    watched
    inWatchlist
    sentiment
  }
}
    `;

/**
 * __useGetMovieInfoQuery__
 *
 * To run a query within a React component, call `useGetMovieInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMovieInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMovieInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMovieInfoQuery(baseOptions: Apollo.QueryHookOptions<GetMovieInfoQuery, GetMovieInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMovieInfoQuery, GetMovieInfoQueryVariables>(GetMovieInfoDocument, options);
      }
export function useGetMovieInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMovieInfoQuery, GetMovieInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMovieInfoQuery, GetMovieInfoQueryVariables>(GetMovieInfoDocument, options);
        }
export type GetMovieInfoQueryHookResult = ReturnType<typeof useGetMovieInfoQuery>;
export type GetMovieInfoLazyQueryHookResult = ReturnType<typeof useGetMovieInfoLazyQuery>;
export type GetMovieInfoQueryResult = Apollo.QueryResult<GetMovieInfoQuery, GetMovieInfoQueryVariables>;
export const GetCrewDocument = gql`
    query GetCrew($id: ID!) {
  crewForMovie(id: $id) {
    id
    name
    profilePath
    jobs
  }
}
    `;

/**
 * __useGetCrewQuery__
 *
 * To run a query within a React component, call `useGetCrewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCrewQuery(baseOptions: Apollo.QueryHookOptions<GetCrewQuery, GetCrewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrewQuery, GetCrewQueryVariables>(GetCrewDocument, options);
      }
export function useGetCrewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrewQuery, GetCrewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrewQuery, GetCrewQueryVariables>(GetCrewDocument, options);
        }
export type GetCrewQueryHookResult = ReturnType<typeof useGetCrewQuery>;
export type GetCrewLazyQueryHookResult = ReturnType<typeof useGetCrewLazyQuery>;
export type GetCrewQueryResult = Apollo.QueryResult<GetCrewQuery, GetCrewQueryVariables>;
export const GetCastDocument = gql`
    query GetCast($id: ID!) {
  castForMovie(id: $id) {
    character
    id
    name
    order
    profilePath
  }
}
    `;

/**
 * __useGetCastQuery__
 *
 * To run a query within a React component, call `useGetCastQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCastQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCastQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCastQuery(baseOptions: Apollo.QueryHookOptions<GetCastQuery, GetCastQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCastQuery, GetCastQueryVariables>(GetCastDocument, options);
      }
export function useGetCastLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCastQuery, GetCastQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCastQuery, GetCastQueryVariables>(GetCastDocument, options);
        }
export type GetCastQueryHookResult = ReturnType<typeof useGetCastQuery>;
export type GetCastLazyQueryHookResult = ReturnType<typeof useGetCastLazyQuery>;
export type GetCastQueryResult = Apollo.QueryResult<GetCastQuery, GetCastQueryVariables>;
export const GetRottenTomatoesScoreDocument = gql`
    query GetRottenTomatoesScore($id: ID!) {
  movie(id: $id) {
    id
    tomatometer {
      score
      consensus
      link
      state
    }
  }
}
    `;

/**
 * __useGetRottenTomatoesScoreQuery__
 *
 * To run a query within a React component, call `useGetRottenTomatoesScoreQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRottenTomatoesScoreQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRottenTomatoesScoreQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRottenTomatoesScoreQuery(baseOptions: Apollo.QueryHookOptions<GetRottenTomatoesScoreQuery, GetRottenTomatoesScoreQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRottenTomatoesScoreQuery, GetRottenTomatoesScoreQueryVariables>(GetRottenTomatoesScoreDocument, options);
      }
export function useGetRottenTomatoesScoreLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRottenTomatoesScoreQuery, GetRottenTomatoesScoreQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRottenTomatoesScoreQuery, GetRottenTomatoesScoreQueryVariables>(GetRottenTomatoesScoreDocument, options);
        }
export type GetRottenTomatoesScoreQueryHookResult = ReturnType<typeof useGetRottenTomatoesScoreQuery>;
export type GetRottenTomatoesScoreLazyQueryHookResult = ReturnType<typeof useGetRottenTomatoesScoreLazyQuery>;
export type GetRottenTomatoesScoreQueryResult = Apollo.QueryResult<GetRottenTomatoesScoreQuery, GetRottenTomatoesScoreQueryVariables>;
export const GetPersonCreditsDocument = gql`
    query GetPersonCredits($id: ID!) {
  creditsForPerson(id: $id) {
    id
    title
    watched
    inWatchlist
    sentiment
    posterPath
    releaseDate
    jobs
    character
  }
}
    `;

/**
 * __useGetPersonCreditsQuery__
 *
 * To run a query within a React component, call `useGetPersonCreditsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonCreditsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonCreditsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPersonCreditsQuery(baseOptions: Apollo.QueryHookOptions<GetPersonCreditsQuery, GetPersonCreditsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPersonCreditsQuery, GetPersonCreditsQueryVariables>(GetPersonCreditsDocument, options);
      }
export function useGetPersonCreditsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPersonCreditsQuery, GetPersonCreditsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPersonCreditsQuery, GetPersonCreditsQueryVariables>(GetPersonCreditsDocument, options);
        }
export type GetPersonCreditsQueryHookResult = ReturnType<typeof useGetPersonCreditsQuery>;
export type GetPersonCreditsLazyQueryHookResult = ReturnType<typeof useGetPersonCreditsLazyQuery>;
export type GetPersonCreditsQueryResult = Apollo.QueryResult<GetPersonCreditsQuery, GetPersonCreditsQueryVariables>;
export const GetPersonInfoDocument = gql`
    query GetPersonInfo($id: ID!) {
  person(id: $id) {
    id
    profilePath
    name
    knownForDepartment
    biography
    favourited
  }
}
    `;

/**
 * __useGetPersonInfoQuery__
 *
 * To run a query within a React component, call `useGetPersonInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPersonInfoQuery(baseOptions: Apollo.QueryHookOptions<GetPersonInfoQuery, GetPersonInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPersonInfoQuery, GetPersonInfoQueryVariables>(GetPersonInfoDocument, options);
      }
export function useGetPersonInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPersonInfoQuery, GetPersonInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPersonInfoQuery, GetPersonInfoQueryVariables>(GetPersonInfoDocument, options);
        }
export type GetPersonInfoQueryHookResult = ReturnType<typeof useGetPersonInfoQuery>;
export type GetPersonInfoLazyQueryHookResult = ReturnType<typeof useGetPersonInfoLazyQuery>;
export type GetPersonInfoQueryResult = Apollo.QueryResult<GetPersonInfoQuery, GetPersonInfoQueryVariables>;
export const SetFavouriteDocument = gql`
    mutation SetFavourite($id: ID!, $favourite: Boolean!) {
  setFavourite(id: $id, favourited: $favourite) {
    id
    favourited
  }
}
    `;
export type SetFavouriteMutationFn = Apollo.MutationFunction<SetFavouriteMutation, SetFavouriteMutationVariables>;

/**
 * __useSetFavouriteMutation__
 *
 * To run a mutation, you first call `useSetFavouriteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetFavouriteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setFavouriteMutation, { data, loading, error }] = useSetFavouriteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      favourite: // value for 'favourite'
 *   },
 * });
 */
export function useSetFavouriteMutation(baseOptions?: Apollo.MutationHookOptions<SetFavouriteMutation, SetFavouriteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetFavouriteMutation, SetFavouriteMutationVariables>(SetFavouriteDocument, options);
      }
export type SetFavouriteMutationHookResult = ReturnType<typeof useSetFavouriteMutation>;
export type SetFavouriteMutationResult = Apollo.MutationResult<SetFavouriteMutation>;
export type SetFavouriteMutationOptions = Apollo.BaseMutationOptions<SetFavouriteMutation, SetFavouriteMutationVariables>;
export const SetSentimentDocument = gql`
    mutation SetSentiment($id: ID!, $sentiment: Sentiment!) {
  setSentiment(id: $id, sentiment: $sentiment) {
    id
    sentiment
  }
}
    `;
export type SetSentimentMutationFn = Apollo.MutationFunction<SetSentimentMutation, SetSentimentMutationVariables>;

/**
 * __useSetSentimentMutation__
 *
 * To run a mutation, you first call `useSetSentimentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSentimentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSentimentMutation, { data, loading, error }] = useSetSentimentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      sentiment: // value for 'sentiment'
 *   },
 * });
 */
export function useSetSentimentMutation(baseOptions?: Apollo.MutationHookOptions<SetSentimentMutation, SetSentimentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSentimentMutation, SetSentimentMutationVariables>(SetSentimentDocument, options);
      }
export type SetSentimentMutationHookResult = ReturnType<typeof useSetSentimentMutation>;
export type SetSentimentMutationResult = Apollo.MutationResult<SetSentimentMutation>;
export type SetSentimentMutationOptions = Apollo.BaseMutationOptions<SetSentimentMutation, SetSentimentMutationVariables>;
export const SetWatchedDocument = gql`
    mutation SetWatched($id: ID!, $watched: Boolean!) {
  setWatched(id: $id, watched: $watched) {
    id
    watched
  }
}
    `;
export type SetWatchedMutationFn = Apollo.MutationFunction<SetWatchedMutation, SetWatchedMutationVariables>;

/**
 * __useSetWatchedMutation__
 *
 * To run a mutation, you first call `useSetWatchedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetWatchedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setWatchedMutation, { data, loading, error }] = useSetWatchedMutation({
 *   variables: {
 *      id: // value for 'id'
 *      watched: // value for 'watched'
 *   },
 * });
 */
export function useSetWatchedMutation(baseOptions?: Apollo.MutationHookOptions<SetWatchedMutation, SetWatchedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetWatchedMutation, SetWatchedMutationVariables>(SetWatchedDocument, options);
      }
export type SetWatchedMutationHookResult = ReturnType<typeof useSetWatchedMutation>;
export type SetWatchedMutationResult = Apollo.MutationResult<SetWatchedMutation>;
export type SetWatchedMutationOptions = Apollo.BaseMutationOptions<SetWatchedMutation, SetWatchedMutationVariables>;
export const SetInWatchlistDocument = gql`
    mutation SetInWatchlist($id: ID!, $inWatchlist: Boolean!) {
  setInWatchlist(id: $id, inWatchlist: $inWatchlist) {
    id
    inWatchlist
  }
}
    `;
export type SetInWatchlistMutationFn = Apollo.MutationFunction<SetInWatchlistMutation, SetInWatchlistMutationVariables>;

/**
 * __useSetInWatchlistMutation__
 *
 * To run a mutation, you first call `useSetInWatchlistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetInWatchlistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setInWatchlistMutation, { data, loading, error }] = useSetInWatchlistMutation({
 *   variables: {
 *      id: // value for 'id'
 *      inWatchlist: // value for 'inWatchlist'
 *   },
 * });
 */
export function useSetInWatchlistMutation(baseOptions?: Apollo.MutationHookOptions<SetInWatchlistMutation, SetInWatchlistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetInWatchlistMutation, SetInWatchlistMutationVariables>(SetInWatchlistDocument, options);
      }
export type SetInWatchlistMutationHookResult = ReturnType<typeof useSetInWatchlistMutation>;
export type SetInWatchlistMutationResult = Apollo.MutationResult<SetInWatchlistMutation>;
export type SetInWatchlistMutationOptions = Apollo.BaseMutationOptions<SetInWatchlistMutation, SetInWatchlistMutationVariables>;
export const GetUpcomingMoviesDocument = gql`
    query GetUpcomingMovies {
  upcoming {
    id
    title
    posterPath
    releaseDate
  }
}
    `;

/**
 * __useGetUpcomingMoviesQuery__
 *
 * To run a query within a React component, call `useGetUpcomingMoviesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUpcomingMoviesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUpcomingMoviesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUpcomingMoviesQuery(baseOptions?: Apollo.QueryHookOptions<GetUpcomingMoviesQuery, GetUpcomingMoviesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUpcomingMoviesQuery, GetUpcomingMoviesQueryVariables>(GetUpcomingMoviesDocument, options);
      }
export function useGetUpcomingMoviesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUpcomingMoviesQuery, GetUpcomingMoviesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUpcomingMoviesQuery, GetUpcomingMoviesQueryVariables>(GetUpcomingMoviesDocument, options);
        }
export type GetUpcomingMoviesQueryHookResult = ReturnType<typeof useGetUpcomingMoviesQuery>;
export type GetUpcomingMoviesLazyQueryHookResult = ReturnType<typeof useGetUpcomingMoviesLazyQuery>;
export type GetUpcomingMoviesQueryResult = Apollo.QueryResult<GetUpcomingMoviesQuery, GetUpcomingMoviesQueryVariables>;
export const GetWatchlistDocument = gql`
    query GetWatchlist($username: String!) {
  user(username: $username) {
    watchlist {
      id
      title
      posterPath
      releaseDate
      watched
      inWatchlist
      sentiment
    }
  }
}
    `;

/**
 * __useGetWatchlistQuery__
 *
 * To run a query within a React component, call `useGetWatchlistQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWatchlistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWatchlistQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetWatchlistQuery(baseOptions: Apollo.QueryHookOptions<GetWatchlistQuery, GetWatchlistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWatchlistQuery, GetWatchlistQueryVariables>(GetWatchlistDocument, options);
      }
export function useGetWatchlistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWatchlistQuery, GetWatchlistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWatchlistQuery, GetWatchlistQueryVariables>(GetWatchlistDocument, options);
        }
export type GetWatchlistQueryHookResult = ReturnType<typeof useGetWatchlistQuery>;
export type GetWatchlistLazyQueryHookResult = ReturnType<typeof useGetWatchlistLazyQuery>;
export type GetWatchlistQueryResult = Apollo.QueryResult<GetWatchlistQuery, GetWatchlistQueryVariables>;