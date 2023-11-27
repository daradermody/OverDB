import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CastCredit = Person & {
  __typename?: 'CastCredit';
  character: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  profilePath?: Maybe<Scalars['String']['output']>;
};

export type CrewCredit = Person & {
  __typename?: 'CrewCredit';
  id: Scalars['ID']['output'];
  jobs: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  profilePath?: Maybe<Scalars['String']['output']>;
};

export type List = {
  __typename?: 'List';
  id: Scalars['ID']['output'];
  items: PaginatedMovies;
  name: Scalars['String']['output'];
  type: ListType;
};


export type ListItemsArgs = {
  filteredByProviders?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export enum ListType {
  Movie = 'MOVIE',
  Person = 'PERSON'
}

export type Movie = {
  __typename?: 'Movie';
  id: Scalars['ID']['output'];
  imdbId: Scalars['ID']['output'];
  inWatchlist?: Maybe<Scalars['Boolean']['output']>;
  overview: Scalars['String']['output'];
  posterPath?: Maybe<Scalars['String']['output']>;
  providers: Array<Provider>;
  releaseDate?: Maybe<Scalars['String']['output']>;
  sentiment?: Maybe<Sentiment>;
  tagline: Scalars['String']['output'];
  title: Scalars['String']['output'];
  tomatometer?: Maybe<Tomatometer>;
  voteAverage: Scalars['Float']['output'];
  watched?: Maybe<Scalars['Boolean']['output']>;
};

export type MovieCredit = {
  __typename?: 'MovieCredit';
  character?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  inWatchlist?: Maybe<Scalars['Boolean']['output']>;
  jobs: Array<Scalars['String']['output']>;
  posterPath?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['String']['output']>;
  sentiment?: Maybe<Sentiment>;
  title: Scalars['String']['output'];
  watched?: Maybe<Scalars['Boolean']['output']>;
};

export type MovieInfo = {
  __typename?: 'MovieInfo';
  id: Scalars['ID']['output'];
  imdbId: Scalars['ID']['output'];
  overview: Scalars['String']['output'];
  posterPath?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['String']['output']>;
  tagline: Scalars['String']['output'];
  title: Scalars['String']['output'];
  tomatometer?: Maybe<Tomatometer>;
  voteAverage: Scalars['Float']['output'];
};

export type MovieOrPerson = Movie | PersonInfo;

export type Mutation = {
  __typename?: 'Mutation';
  addToList: List;
  createList: List;
  deleteLists: Scalars['Boolean']['output'];
  editList: List;
  removeFromList: List;
  setFavourite: PersonInfo;
  setInWatchlist: Movie;
  setSentiment: Movie;
  setWatched: Movie;
  updateUserSettings: UserSettings;
};


export type MutationAddToListArgs = {
  itemId: Scalars['ID']['input'];
  listId: Scalars['ID']['input'];
};


export type MutationCreateListArgs = {
  name: Scalars['String']['input'];
  type: ListType;
};


export type MutationDeleteListsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationEditListArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationRemoveFromListArgs = {
  itemId: Scalars['ID']['input'];
  listId: Scalars['ID']['input'];
};


export type MutationSetFavouriteArgs = {
  favourited: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationSetInWatchlistArgs = {
  id: Scalars['ID']['input'];
  inWatchlist: Scalars['Boolean']['input'];
};


export type MutationSetSentimentArgs = {
  id: Scalars['ID']['input'];
  sentiment: Sentiment;
};


export type MutationSetWatchedArgs = {
  id: Scalars['ID']['input'];
  watched: Scalars['Boolean']['input'];
};


export type MutationUpdateUserSettingsArgs = {
  settings: UserSettingsInput;
};

export type PaginatedMovies = {
  __typename?: 'PaginatedMovies';
  endReached: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<Movie>;
  total: Scalars['Int']['output'];
};

export type PaginatedPeople = {
  __typename?: 'PaginatedPeople';
  endReached: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  results: Array<PersonInfo>;
};

export type Person = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profilePath?: Maybe<Scalars['String']['output']>;
};

export type PersonInfo = Person & {
  __typename?: 'PersonInfo';
  biography?: Maybe<Scalars['String']['output']>;
  favourited?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  knownForDepartment?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  profilePath?: Maybe<Scalars['String']['output']>;
};

export type Provider = {
  __typename?: 'Provider';
  id: Scalars['ID']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  castForMovie: Array<CastCredit>;
  creditsForPerson: Array<MovieCredit>;
  crewForMovie: Array<CrewCredit>;
  movie: Movie;
  person: PersonInfo;
  recommendedMovies: Array<Movie>;
  search: Array<MovieOrPerson>;
  settings: UserSettings;
  streamingProviders: Array<Provider>;
  trending: Array<MovieInfo>;
  upcoming: Array<Movie>;
  user: User;
  users: Array<User>;
};


export type QueryCastForMovieArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCreditsForPersonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCrewForMovieArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMovieArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPersonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecommendedMoviesArgs = {
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchArgs = {
  query: Scalars['String']['input'];
};


export type QueryStreamingProvidersArgs = {
  region: Scalars['String']['input'];
};


export type QueryTrendingArgs = {
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  username: Scalars['ID']['input'];
};

export enum Sentiment {
  Disliked = 'DISLIKED',
  Liked = 'LIKED',
  None = 'NONE'
}

export type Stats = {
  __typename?: 'Stats';
  favouritePeople: Scalars['Int']['output'];
  moviesLiked: Scalars['Int']['output'];
  watched: Scalars['Int']['output'];
  watchlist: Scalars['Int']['output'];
};

export type Tomatometer = {
  __typename?: 'Tomatometer';
  consensus?: Maybe<Scalars['String']['output']>;
  link: Scalars['String']['output'];
  score: Scalars['Int']['output'];
  state: TomatometerState;
};

export enum TomatometerState {
  CertifiedFresh = 'CERTIFIED_FRESH',
  Fresh = 'FRESH',
  Rotten = 'ROTTEN'
}

export type User = {
  __typename?: 'User';
  avatarUrl: Scalars['String']['output'];
  favouritePeople: PaginatedPeople;
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  likedMovies: PaginatedMovies;
  list: List;
  lists: Array<List>;
  public?: Maybe<Scalars['Boolean']['output']>;
  stats: Stats;
  username: Scalars['ID']['output'];
  watched: PaginatedMovies;
};


export type UserFavouritePeopleArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type UserLikedMoviesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type UserListArgs = {
  id: Scalars['ID']['input'];
};


export type UserListsArgs = {
  type?: InputMaybe<ListType>;
};


export type UserWatchedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type UserSettings = {
  __typename?: 'UserSettings';
  streaming: UserStreamingSettings;
};

export type UserSettingsInput = {
  streaming?: InputMaybe<UserStreamingSettingsInput>;
};

export type UserStreamingSettings = {
  __typename?: 'UserStreamingSettings';
  providers: Array<Scalars['ID']['output']>;
  region?: Maybe<Scalars['ID']['output']>;
};

export type UserStreamingSettingsInput = {
  providers?: InputMaybe<Array<Scalars['ID']['input']>>;
  region?: InputMaybe<Scalars['ID']['input']>;
};

export type GetFavouritePeopleQueryVariables = Exact<{
  username: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFavouritePeopleQuery = { __typename?: 'Query', user: { __typename?: 'User', favouritePeople: { __typename?: 'PaginatedPeople', endReached: boolean, results: Array<{ __typename?: 'PersonInfo', id: string, profilePath?: string | null, name: string }> } } };

export type GetLikedMoviesQueryVariables = Exact<{
  username: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetLikedMoviesQuery = { __typename?: 'Query', user: { __typename?: 'User', likedMovies: { __typename?: 'PaginatedMovies', endReached: boolean, results: Array<{ __typename?: 'Movie', id: string, title: string, posterPath?: string | null, releaseDate?: string | null }> } } };

export type GetUserQueryVariables = Exact<{
  username: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', avatarUrl: string } };

export type GetUserStatsQueryVariables = Exact<{
  username: Scalars['ID']['input'];
}>;


export type GetUserStatsQuery = { __typename?: 'Query', user: { __typename?: 'User', stats: { __typename?: 'Stats', favouritePeople: number, watched: number, moviesLiked: number, watchlist: number } } };

export type GetUserSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserSettingsQuery = { __typename?: 'Query', settings: { __typename?: 'UserSettings', streaming: { __typename?: 'UserStreamingSettings', region?: string | null, providers: Array<string> } } };

export type UpdateUserSettingsMutationVariables = Exact<{
  settings: UserSettingsInput;
}>;


export type UpdateUserSettingsMutation = { __typename?: 'Mutation', updateUserSettings: { __typename?: 'UserSettings', streaming: { __typename?: 'UserStreamingSettings', region?: string | null, providers: Array<string> } } };

export type GetAllStreamingProvidersQueryVariables = Exact<{
  region: Scalars['String']['input'];
}>;


export type GetAllStreamingProvidersQuery = { __typename?: 'Query', streamingProviders: Array<{ __typename?: 'Provider', id: string, name: string, logo: string }> };

export type GetWatchedMoviesQueryVariables = Exact<{
  username: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetWatchedMoviesQuery = { __typename?: 'Query', user: { __typename?: 'User', watched: { __typename?: 'PaginatedMovies', endReached: boolean, results: Array<{ __typename?: 'Movie', id: string, title: string, posterPath?: string | null, releaseDate?: string | null, watched?: boolean | null, inWatchlist?: boolean | null, sentiment?: Sentiment | null }> } } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', username: string, avatarUrl: string, isAdmin?: boolean | null, stats: { __typename?: 'Stats', favouritePeople: number, moviesLiked: number, watched: number, watchlist: number } }> };

export type SearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Movie', id: string, title: string, posterPath?: string | null, releaseDate?: string | null } | { __typename?: 'PersonInfo', id: string, name: string, profilePath?: string | null }> };

export type GetTrendingMoviesQueryVariables = Exact<{
  size: Scalars['Int']['input'];
}>;


export type GetTrendingMoviesQuery = { __typename?: 'Query', trending: Array<{ __typename?: 'MovieInfo', id: string, title: string, posterPath?: string | null, releaseDate?: string | null }> };

export type GetRecommendedMoviesQueryVariables = Exact<{
  size: Scalars['Int']['input'];
}>;


export type GetRecommendedMoviesQuery = { __typename?: 'Query', recommendedMovies: Array<{ __typename?: 'Movie', id: string, posterPath?: string | null, title: string, releaseDate?: string | null, watched?: boolean | null, inWatchlist?: boolean | null, sentiment?: Sentiment | null }> };

export type CreateListMutationVariables = Exact<{
  name: Scalars['String']['input'];
  type: ListType;
}>;


export type CreateListMutation = { __typename?: 'Mutation', createList: { __typename?: 'List', id: string } };

export type DeleteListsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteListsMutation = { __typename?: 'Mutation', deleteLists: boolean };

export type EditListMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type EditListMutation = { __typename?: 'Mutation', editList: { __typename?: 'List', id: string } };

export type GetListQueryVariables = Exact<{
  username: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filteredByProviders?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetListQuery = { __typename?: 'Query', user: { __typename?: 'User', list: { __typename?: 'List', id: string, name: string, type: ListType, items: { __typename?: 'PaginatedMovies', endReached: boolean, results: Array<{ __typename?: 'Movie', id: string, posterPath?: string | null, title: string, releaseDate?: string | null, watched?: boolean | null, inWatchlist?: boolean | null, sentiment?: Sentiment | null }> } } } };

export type GetSubscribedStreamingProvidersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSubscribedStreamingProvidersQuery = { __typename?: 'Query', settings: { __typename?: 'UserSettings', streaming: { __typename?: 'UserStreamingSettings', providers: Array<string> } } };

export type GetListsQueryVariables = Exact<{
  username: Scalars['ID']['input'];
}>;


export type GetListsQuery = { __typename?: 'Query', user: { __typename?: 'User', lists: Array<{ __typename?: 'List', id: string, name: string, type: ListType }> } };

export type GetMovieInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMovieInfoQuery = { __typename?: 'Query', movie: { __typename?: 'Movie', id: string, title: string, tagline: string, overview: string, voteAverage: number, posterPath?: string | null, releaseDate?: string | null, watched?: boolean | null, inWatchlist?: boolean | null, sentiment?: Sentiment | null } };

export type GetCrewQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCrewQuery = { __typename?: 'Query', crewForMovie: Array<{ __typename?: 'CrewCredit', id: string, name: string, profilePath?: string | null, jobs: Array<string> }> };

export type GetCastQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCastQuery = { __typename?: 'Query', castForMovie: Array<{ __typename?: 'CastCredit', character: string, id: string, name: string, order: number, profilePath?: string | null }> };

export type GetRottenTomatoesScoreQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRottenTomatoesScoreQuery = { __typename?: 'Query', movie: { __typename?: 'Movie', id: string, tomatometer?: { __typename?: 'Tomatometer', score: number, consensus?: string | null, link: string, state: TomatometerState } | null } };

export type GetStreamingProvidersQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStreamingProvidersQuery = { __typename?: 'Query', movie: { __typename?: 'Movie', providers: Array<{ __typename?: 'Provider', logo: string, name: string }> } };

export type GetPersonCreditsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPersonCreditsQuery = { __typename?: 'Query', creditsForPerson: Array<{ __typename?: 'MovieCredit', id: string, title: string, watched?: boolean | null, inWatchlist?: boolean | null, sentiment?: Sentiment | null, posterPath?: string | null, releaseDate?: string | null, jobs: Array<string>, character?: string | null }> };

export type GetPersonInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPersonInfoQuery = { __typename?: 'Query', person: { __typename?: 'PersonInfo', id: string, profilePath?: string | null, name: string, knownForDepartment?: string | null, biography?: string | null, favourited?: boolean | null } };

export type SetFavouriteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  favourite: Scalars['Boolean']['input'];
}>;


export type SetFavouriteMutation = { __typename?: 'Mutation', setFavourite: { __typename?: 'PersonInfo', id: string, favourited?: boolean | null } };

export type GetMovieListsQueryVariables = Exact<{
  username: Scalars['ID']['input'];
}>;


export type GetMovieListsQuery = { __typename?: 'Query', user: { __typename?: 'User', lists: Array<{ __typename?: 'List', id: string, name: string, type: ListType, items: { __typename?: 'PaginatedMovies', results: Array<{ __typename?: 'Movie', id: string }> } }> } };

export type AddToListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
}>;


export type AddToListMutation = { __typename?: 'Mutation', addToList: { __typename?: 'List', id: string } };

export type RemoveFromListMutationVariables = Exact<{
  listId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
}>;


export type RemoveFromListMutation = { __typename?: 'Mutation', removeFromList: { __typename?: 'List', id: string } };

export type SetSentimentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  sentiment: Sentiment;
}>;


export type SetSentimentMutation = { __typename?: 'Mutation', setSentiment: { __typename?: 'Movie', id: string, sentiment?: Sentiment | null } };

export type SetWatchedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  watched: Scalars['Boolean']['input'];
}>;


export type SetWatchedMutation = { __typename?: 'Mutation', setWatched: { __typename?: 'Movie', id: string, watched?: boolean | null } };

export type SetInWatchlistMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  inWatchlist: Scalars['Boolean']['input'];
}>;


export type SetInWatchlistMutation = { __typename?: 'Mutation', setInWatchlist: { __typename?: 'Movie', id: string, inWatchlist?: boolean | null } };

export type GetUpcomingMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUpcomingMoviesQuery = { __typename?: 'Query', upcoming: Array<{ __typename?: 'Movie', id: string, title: string, posterPath?: string | null, releaseDate?: string | null }> };


export const GetFavouritePeopleDocument = gql`
    query GetFavouritePeople($username: ID!, $offset: Int, $limit: Int) {
  user(username: $username) {
    favouritePeople(offset: $offset, limit: $limit) {
      endReached
      results {
        id
        profilePath
        name
      }
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
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
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
    query GetLikedMovies($username: ID!, $offset: Int, $limit: Int) {
  user(username: $username) {
    likedMovies(offset: $offset, limit: $limit) {
      endReached
      results {
        id
        title
        posterPath
        releaseDate
      }
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
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
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
    query GetUser($username: ID!) {
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
    query GetUserStats($username: ID!) {
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
export const GetUserSettingsDocument = gql`
    query GetUserSettings {
  settings {
    streaming {
      region
      providers
    }
  }
}
    `;

/**
 * __useGetUserSettingsQuery__
 *
 * To run a query within a React component, call `useGetUserSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserSettingsQuery, GetUserSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserSettingsQuery, GetUserSettingsQueryVariables>(GetUserSettingsDocument, options);
      }
export function useGetUserSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserSettingsQuery, GetUserSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserSettingsQuery, GetUserSettingsQueryVariables>(GetUserSettingsDocument, options);
        }
export type GetUserSettingsQueryHookResult = ReturnType<typeof useGetUserSettingsQuery>;
export type GetUserSettingsLazyQueryHookResult = ReturnType<typeof useGetUserSettingsLazyQuery>;
export type GetUserSettingsQueryResult = Apollo.QueryResult<GetUserSettingsQuery, GetUserSettingsQueryVariables>;
export const UpdateUserSettingsDocument = gql`
    mutation UpdateUserSettings($settings: UserSettingsInput!) {
  updateUserSettings(settings: $settings) {
    streaming {
      region
      providers
    }
  }
}
    `;
export type UpdateUserSettingsMutationFn = Apollo.MutationFunction<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>;

/**
 * __useUpdateUserSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateUserSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserSettingsMutation, { data, loading, error }] = useUpdateUserSettingsMutation({
 *   variables: {
 *      settings: // value for 'settings'
 *   },
 * });
 */
export function useUpdateUserSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>(UpdateUserSettingsDocument, options);
      }
export type UpdateUserSettingsMutationHookResult = ReturnType<typeof useUpdateUserSettingsMutation>;
export type UpdateUserSettingsMutationResult = Apollo.MutationResult<UpdateUserSettingsMutation>;
export type UpdateUserSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateUserSettingsMutation, UpdateUserSettingsMutationVariables>;
export const GetAllStreamingProvidersDocument = gql`
    query GetAllStreamingProviders($region: String!) {
  streamingProviders(region: $region) {
    id
    name
    logo
  }
}
    `;

/**
 * __useGetAllStreamingProvidersQuery__
 *
 * To run a query within a React component, call `useGetAllStreamingProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllStreamingProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllStreamingProvidersQuery({
 *   variables: {
 *      region: // value for 'region'
 *   },
 * });
 */
export function useGetAllStreamingProvidersQuery(baseOptions: Apollo.QueryHookOptions<GetAllStreamingProvidersQuery, GetAllStreamingProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllStreamingProvidersQuery, GetAllStreamingProvidersQueryVariables>(GetAllStreamingProvidersDocument, options);
      }
export function useGetAllStreamingProvidersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllStreamingProvidersQuery, GetAllStreamingProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllStreamingProvidersQuery, GetAllStreamingProvidersQueryVariables>(GetAllStreamingProvidersDocument, options);
        }
export type GetAllStreamingProvidersQueryHookResult = ReturnType<typeof useGetAllStreamingProvidersQuery>;
export type GetAllStreamingProvidersLazyQueryHookResult = ReturnType<typeof useGetAllStreamingProvidersLazyQuery>;
export type GetAllStreamingProvidersQueryResult = Apollo.QueryResult<GetAllStreamingProvidersQuery, GetAllStreamingProvidersQueryVariables>;
export const GetWatchedMoviesDocument = gql`
    query GetWatchedMovies($username: ID!, $offset: Int, $limit: Int) {
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
export const GetUsersDocument = gql`
    query GetUsers {
  users {
    username
    avatarUrl
    isAdmin
    stats {
      favouritePeople
      moviesLiked
      watched
      watchlist
    }
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
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
export const CreateListDocument = gql`
    mutation CreateList($name: String!, $type: ListType!) {
  createList(name: $name, type: $type) {
    id
  }
}
    `;
export type CreateListMutationFn = Apollo.MutationFunction<CreateListMutation, CreateListMutationVariables>;

/**
 * __useCreateListMutation__
 *
 * To run a mutation, you first call `useCreateListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createListMutation, { data, loading, error }] = useCreateListMutation({
 *   variables: {
 *      name: // value for 'name'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCreateListMutation(baseOptions?: Apollo.MutationHookOptions<CreateListMutation, CreateListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateListMutation, CreateListMutationVariables>(CreateListDocument, options);
      }
export type CreateListMutationHookResult = ReturnType<typeof useCreateListMutation>;
export type CreateListMutationResult = Apollo.MutationResult<CreateListMutation>;
export type CreateListMutationOptions = Apollo.BaseMutationOptions<CreateListMutation, CreateListMutationVariables>;
export const DeleteListsDocument = gql`
    mutation DeleteLists($ids: [ID!]!) {
  deleteLists(ids: $ids)
}
    `;
export type DeleteListsMutationFn = Apollo.MutationFunction<DeleteListsMutation, DeleteListsMutationVariables>;

/**
 * __useDeleteListsMutation__
 *
 * To run a mutation, you first call `useDeleteListsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteListsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteListsMutation, { data, loading, error }] = useDeleteListsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteListsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteListsMutation, DeleteListsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteListsMutation, DeleteListsMutationVariables>(DeleteListsDocument, options);
      }
export type DeleteListsMutationHookResult = ReturnType<typeof useDeleteListsMutation>;
export type DeleteListsMutationResult = Apollo.MutationResult<DeleteListsMutation>;
export type DeleteListsMutationOptions = Apollo.BaseMutationOptions<DeleteListsMutation, DeleteListsMutationVariables>;
export const EditListDocument = gql`
    mutation EditList($id: ID!, $name: String!) {
  editList(id: $id, name: $name) {
    id
  }
}
    `;
export type EditListMutationFn = Apollo.MutationFunction<EditListMutation, EditListMutationVariables>;

/**
 * __useEditListMutation__
 *
 * To run a mutation, you first call `useEditListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editListMutation, { data, loading, error }] = useEditListMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useEditListMutation(baseOptions?: Apollo.MutationHookOptions<EditListMutation, EditListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditListMutation, EditListMutationVariables>(EditListDocument, options);
      }
export type EditListMutationHookResult = ReturnType<typeof useEditListMutation>;
export type EditListMutationResult = Apollo.MutationResult<EditListMutation>;
export type EditListMutationOptions = Apollo.BaseMutationOptions<EditListMutation, EditListMutationVariables>;
export const GetListDocument = gql`
    query GetList($username: ID!, $id: ID!, $offset: Int, $limit: Int, $filteredByProviders: Boolean) {
  user(username: $username) {
    list(id: $id) {
      id
      name
      type
      items(offset: $offset, limit: $limit, filteredByProviders: $filteredByProviders) {
        endReached
        results {
          id
          posterPath
          title
          releaseDate
          watched
          inWatchlist
          sentiment
        }
      }
    }
  }
}
    `;

/**
 * __useGetListQuery__
 *
 * To run a query within a React component, call `useGetListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListQuery({
 *   variables: {
 *      username: // value for 'username'
 *      id: // value for 'id'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      filteredByProviders: // value for 'filteredByProviders'
 *   },
 * });
 */
export function useGetListQuery(baseOptions: Apollo.QueryHookOptions<GetListQuery, GetListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetListQuery, GetListQueryVariables>(GetListDocument, options);
      }
export function useGetListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetListQuery, GetListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetListQuery, GetListQueryVariables>(GetListDocument, options);
        }
export type GetListQueryHookResult = ReturnType<typeof useGetListQuery>;
export type GetListLazyQueryHookResult = ReturnType<typeof useGetListLazyQuery>;
export type GetListQueryResult = Apollo.QueryResult<GetListQuery, GetListQueryVariables>;
export const GetSubscribedStreamingProvidersDocument = gql`
    query GetSubscribedStreamingProviders {
  settings {
    streaming {
      providers
    }
  }
}
    `;

/**
 * __useGetSubscribedStreamingProvidersQuery__
 *
 * To run a query within a React component, call `useGetSubscribedStreamingProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubscribedStreamingProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubscribedStreamingProvidersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSubscribedStreamingProvidersQuery(baseOptions?: Apollo.QueryHookOptions<GetSubscribedStreamingProvidersQuery, GetSubscribedStreamingProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSubscribedStreamingProvidersQuery, GetSubscribedStreamingProvidersQueryVariables>(GetSubscribedStreamingProvidersDocument, options);
      }
export function useGetSubscribedStreamingProvidersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSubscribedStreamingProvidersQuery, GetSubscribedStreamingProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSubscribedStreamingProvidersQuery, GetSubscribedStreamingProvidersQueryVariables>(GetSubscribedStreamingProvidersDocument, options);
        }
export type GetSubscribedStreamingProvidersQueryHookResult = ReturnType<typeof useGetSubscribedStreamingProvidersQuery>;
export type GetSubscribedStreamingProvidersLazyQueryHookResult = ReturnType<typeof useGetSubscribedStreamingProvidersLazyQuery>;
export type GetSubscribedStreamingProvidersQueryResult = Apollo.QueryResult<GetSubscribedStreamingProvidersQuery, GetSubscribedStreamingProvidersQueryVariables>;
export const GetListsDocument = gql`
    query GetLists($username: ID!) {
  user(username: $username) {
    lists {
      id
      name
      type
    }
  }
}
    `;

/**
 * __useGetListsQuery__
 *
 * To run a query within a React component, call `useGetListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListsQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetListsQuery(baseOptions: Apollo.QueryHookOptions<GetListsQuery, GetListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetListsQuery, GetListsQueryVariables>(GetListsDocument, options);
      }
export function useGetListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetListsQuery, GetListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetListsQuery, GetListsQueryVariables>(GetListsDocument, options);
        }
export type GetListsQueryHookResult = ReturnType<typeof useGetListsQuery>;
export type GetListsLazyQueryHookResult = ReturnType<typeof useGetListsLazyQuery>;
export type GetListsQueryResult = Apollo.QueryResult<GetListsQuery, GetListsQueryVariables>;
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
export const GetStreamingProvidersDocument = gql`
    query GetStreamingProviders($id: ID!) {
  movie(id: $id) {
    providers {
      logo
      name
    }
  }
}
    `;

/**
 * __useGetStreamingProvidersQuery__
 *
 * To run a query within a React component, call `useGetStreamingProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStreamingProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStreamingProvidersQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStreamingProvidersQuery(baseOptions: Apollo.QueryHookOptions<GetStreamingProvidersQuery, GetStreamingProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStreamingProvidersQuery, GetStreamingProvidersQueryVariables>(GetStreamingProvidersDocument, options);
      }
export function useGetStreamingProvidersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStreamingProvidersQuery, GetStreamingProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStreamingProvidersQuery, GetStreamingProvidersQueryVariables>(GetStreamingProvidersDocument, options);
        }
export type GetStreamingProvidersQueryHookResult = ReturnType<typeof useGetStreamingProvidersQuery>;
export type GetStreamingProvidersLazyQueryHookResult = ReturnType<typeof useGetStreamingProvidersLazyQuery>;
export type GetStreamingProvidersQueryResult = Apollo.QueryResult<GetStreamingProvidersQuery, GetStreamingProvidersQueryVariables>;
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
export const GetMovieListsDocument = gql`
    query GetMovieLists($username: ID!) {
  user(username: $username) {
    lists(type: MOVIE) {
      id
      name
      type
      items {
        results {
          id
        }
      }
    }
  }
}
    `;

/**
 * __useGetMovieListsQuery__
 *
 * To run a query within a React component, call `useGetMovieListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMovieListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMovieListsQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetMovieListsQuery(baseOptions: Apollo.QueryHookOptions<GetMovieListsQuery, GetMovieListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMovieListsQuery, GetMovieListsQueryVariables>(GetMovieListsDocument, options);
      }
export function useGetMovieListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMovieListsQuery, GetMovieListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMovieListsQuery, GetMovieListsQueryVariables>(GetMovieListsDocument, options);
        }
export type GetMovieListsQueryHookResult = ReturnType<typeof useGetMovieListsQuery>;
export type GetMovieListsLazyQueryHookResult = ReturnType<typeof useGetMovieListsLazyQuery>;
export type GetMovieListsQueryResult = Apollo.QueryResult<GetMovieListsQuery, GetMovieListsQueryVariables>;
export const AddToListDocument = gql`
    mutation AddToList($listId: ID!, $itemId: ID!) {
  addToList(listId: $listId, itemId: $itemId) {
    id
  }
}
    `;
export type AddToListMutationFn = Apollo.MutationFunction<AddToListMutation, AddToListMutationVariables>;

/**
 * __useAddToListMutation__
 *
 * To run a mutation, you first call `useAddToListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToListMutation, { data, loading, error }] = useAddToListMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *      itemId: // value for 'itemId'
 *   },
 * });
 */
export function useAddToListMutation(baseOptions?: Apollo.MutationHookOptions<AddToListMutation, AddToListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddToListMutation, AddToListMutationVariables>(AddToListDocument, options);
      }
export type AddToListMutationHookResult = ReturnType<typeof useAddToListMutation>;
export type AddToListMutationResult = Apollo.MutationResult<AddToListMutation>;
export type AddToListMutationOptions = Apollo.BaseMutationOptions<AddToListMutation, AddToListMutationVariables>;
export const RemoveFromListDocument = gql`
    mutation RemoveFromList($listId: ID!, $itemId: ID!) {
  removeFromList(listId: $listId, itemId: $itemId) {
    id
  }
}
    `;
export type RemoveFromListMutationFn = Apollo.MutationFunction<RemoveFromListMutation, RemoveFromListMutationVariables>;

/**
 * __useRemoveFromListMutation__
 *
 * To run a mutation, you first call `useRemoveFromListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFromListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFromListMutation, { data, loading, error }] = useRemoveFromListMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *      itemId: // value for 'itemId'
 *   },
 * });
 */
export function useRemoveFromListMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFromListMutation, RemoveFromListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFromListMutation, RemoveFromListMutationVariables>(RemoveFromListDocument, options);
      }
export type RemoveFromListMutationHookResult = ReturnType<typeof useRemoveFromListMutation>;
export type RemoveFromListMutationResult = Apollo.MutationResult<RemoveFromListMutation>;
export type RemoveFromListMutationOptions = Apollo.BaseMutationOptions<RemoveFromListMutation, RemoveFromListMutationVariables>;
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