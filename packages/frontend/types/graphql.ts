import { GraphQLResolveInfo } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
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
  setFavourite: Person;
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
  __typename?: 'Person';
  biography?: Maybe<Scalars['String']>;
  favourited: Scalars['Boolean'];
  id: Scalars['ID'];
  knownForDepartment?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  profilePath?: Maybe<Scalars['String']>;
};

export type PersonCredit = {
  __typename?: 'PersonCredit';
  id: Scalars['ID'];
  jobs: Array<Scalars['String']>;
  name: Scalars['String'];
  profilePath?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  creditsForMovie: Array<PersonCredit>;
  creditsForPerson: Array<MovieCredit>;
  favouritePeople: Array<Person>;
  likedMovies: Array<Movie>;
  movie: Movie;
  person: Person;
  recommendedMovies: Array<Movie>;
  search: Array<SearchResult>;
  trending: Array<MovieInfo>;
  watched: PaginatedMovies;
  watchlist: Array<Movie>;
};


export type QueryCreditsForMovieArgs = {
  id: Scalars['ID'];
};


export type QueryCreditsForPersonArgs = {
  id: Scalars['ID'];
};


export type QueryMovieArgs = {
  id: Scalars['ID'];
};


export type QueryPersonArgs = {
  id: Scalars['ID'];
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryWatchedArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type SearchResult = Movie | Person;

export enum Sentiment {
  Disliked = 'DISLIKED',
  Liked = 'LIKED',
  None = 'NONE'
}

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

export type GetFavouritePeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFavouritePeopleQuery = { __typename?: 'Query', favouritePeople: Array<{ __typename?: 'Person', id: string, profilePath?: string | null, name: string }> };

export type GetLikedMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLikedMoviesQuery = { __typename?: 'Query', likedMovies: Array<{ __typename?: 'Movie', id: string, title: string, posterPath?: string | null, releaseDate?: string | null }> };

export type GetWatchedMoviesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetWatchedMoviesQuery = { __typename?: 'Query', watched: { __typename?: 'PaginatedMovies', endReached: boolean, results: Array<{ __typename?: 'Movie', id: string, title: string, posterPath?: string | null, releaseDate?: string | null, watched: boolean, inWatchlist: boolean, sentiment: Sentiment }> } };

export type SearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Movie', id: string, title: string, posterPath?: string | null, releaseDate?: string | null } | { __typename?: 'Person', id: string, name: string, profilePath?: string | null }> };

export type GetTrendingMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTrendingMoviesQuery = { __typename?: 'Query', trending: Array<{ __typename?: 'MovieInfo', id: string, title: string, posterPath?: string | null, releaseDate?: string | null }> };

export type GetRecommendedMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecommendedMoviesQuery = { __typename?: 'Query', recommendedMovies: Array<{ __typename?: 'Movie', id: string, posterPath?: string | null, title: string, releaseDate?: string | null, watched: boolean, inWatchlist: boolean, sentiment: Sentiment }> };

export type GetMovieInfoQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetMovieInfoQuery = { __typename?: 'Query', movie: { __typename?: 'Movie', id: string, title: string, tagline: string, overview: string, voteAverage: number, posterPath?: string | null, releaseDate?: string | null, watched: boolean, inWatchlist: boolean, sentiment: Sentiment } };

export type GetCreditsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCreditsQuery = { __typename?: 'Query', creditsForMovie: Array<{ __typename?: 'PersonCredit', id: string, name: string, profilePath?: string | null, jobs: Array<string> }> };

export type GetRottenTomatoesScoreQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetRottenTomatoesScoreQuery = { __typename?: 'Query', movie: { __typename?: 'Movie', id: string, tomatometer?: { __typename?: 'Tomatometer', score: number, consensus?: string | null, link: string, state: TomatometerState } | null } };

export type GetPersonCreditsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPersonCreditsQuery = { __typename?: 'Query', creditsForPerson: Array<{ __typename?: 'MovieCredit', id: string, title: string, watched: boolean, inWatchlist: boolean, sentiment: Sentiment, posterPath?: string | null, releaseDate?: string | null, jobs: Array<string> }> };

export type GetPersonInfoQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPersonInfoQuery = { __typename?: 'Query', person: { __typename?: 'Person', id: string, profilePath?: string | null, name: string, knownForDepartment?: string | null, biography?: string | null, favourited: boolean } };

export type SetFavouriteMutationVariables = Exact<{
  id: Scalars['ID'];
  favourite: Scalars['Boolean'];
}>;


export type SetFavouriteMutation = { __typename?: 'Mutation', setFavourite: { __typename?: 'Person', id: string, favourited: boolean } };

export type SetSentimentMutationVariables = Exact<{
  id: Scalars['ID'];
  sentiment: Sentiment;
}>;


export type SetSentimentMutation = { __typename?: 'Mutation', setSentiment: { __typename?: 'Movie', id: string, sentiment: Sentiment } };

export type SetWatchedMutationVariables = Exact<{
  id: Scalars['ID'];
  watched: Scalars['Boolean'];
}>;


export type SetWatchedMutation = { __typename?: 'Mutation', setWatched: { __typename?: 'Movie', id: string, watched: boolean } };

export type SetInWatchlistMutationVariables = Exact<{
  id: Scalars['ID'];
  inWatchlist: Scalars['Boolean'];
}>;


export type SetInWatchlistMutation = { __typename?: 'Mutation', setInWatchlist: { __typename?: 'Movie', id: string, inWatchlist: boolean } };

export type GetWatchlistQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWatchlistQuery = { __typename?: 'Query', watchlist: Array<{ __typename?: 'Movie', id: string, title: string, posterPath?: string | null, releaseDate?: string | null, watched: boolean, inWatchlist: boolean, sentiment: Sentiment }> };

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Movie: ResolverTypeWrapper<Movie>;
  MovieCredit: ResolverTypeWrapper<MovieCredit>;
  MovieInfo: ResolverTypeWrapper<MovieInfo>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginatedMovies: ResolverTypeWrapper<PaginatedMovies>;
  Person: ResolverTypeWrapper<Person>;
  PersonCredit: ResolverTypeWrapper<PersonCredit>;
  Query: ResolverTypeWrapper<{}>;
  SearchResult: ResolversTypes['Movie'] | ResolversTypes['Person'];
  Sentiment: Sentiment;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tomatometer: ResolverTypeWrapper<Tomatometer>;
  TomatometerState: TomatometerState;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Movie: Movie;
  MovieCredit: MovieCredit;
  MovieInfo: MovieInfo;
  Mutation: {};
  PaginatedMovies: PaginatedMovies;
  Person: Person;
  PersonCredit: PersonCredit;
  Query: {};
  SearchResult: ResolversParentTypes['Movie'] | ResolversParentTypes['Person'];
  String: Scalars['String'];
  Tomatometer: Tomatometer;
}>;

export type MovieResolvers<ContextType = any, ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inWatchlist?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  overview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posterPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  releaseDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sentiment?: Resolver<ResolversTypes['Sentiment'], ParentType, ContextType>;
  tagline?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tomatometer?: Resolver<Maybe<ResolversTypes['Tomatometer']>, ParentType, ContextType>;
  voteAverage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  watched?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MovieCreditResolvers<ContextType = any, ParentType extends ResolversParentTypes['MovieCredit'] = ResolversParentTypes['MovieCredit']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inWatchlist?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  jobs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  posterPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  releaseDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sentiment?: Resolver<ResolversTypes['Sentiment'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  watched?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MovieInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['MovieInfo'] = ResolversParentTypes['MovieInfo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  overview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posterPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  releaseDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tagline?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tomatometer?: Resolver<Maybe<ResolversTypes['Tomatometer']>, ParentType, ContextType>;
  voteAverage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  setFavourite?: Resolver<ResolversTypes['Person'], ParentType, ContextType, RequireFields<MutationSetFavouriteArgs, 'favourited' | 'id'>>;
  setInWatchlist?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationSetInWatchlistArgs, 'id' | 'inWatchlist'>>;
  setSentiment?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationSetSentimentArgs, 'id' | 'sentiment'>>;
  setWatched?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationSetWatchedArgs, 'id' | 'watched'>>;
}>;

export type PaginatedMoviesResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedMovies'] = ResolversParentTypes['PaginatedMovies']> = ResolversObject<{
  endReached?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = ResolversObject<{
  biography?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  favourited?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  knownForDepartment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profilePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonCreditResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonCredit'] = ResolversParentTypes['PersonCredit']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profilePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  creditsForMovie?: Resolver<Array<ResolversTypes['PersonCredit']>, ParentType, ContextType, RequireFields<QueryCreditsForMovieArgs, 'id'>>;
  creditsForPerson?: Resolver<Array<ResolversTypes['MovieCredit']>, ParentType, ContextType, RequireFields<QueryCreditsForPersonArgs, 'id'>>;
  favouritePeople?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType>;
  likedMovies?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  movie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<QueryMovieArgs, 'id'>>;
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType, RequireFields<QueryPersonArgs, 'id'>>;
  recommendedMovies?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  search?: Resolver<Array<ResolversTypes['SearchResult']>, ParentType, ContextType, RequireFields<QuerySearchArgs, 'query'>>;
  trending?: Resolver<Array<ResolversTypes['MovieInfo']>, ParentType, ContextType>;
  watched?: Resolver<ResolversTypes['PaginatedMovies'], ParentType, ContextType, Partial<QueryWatchedArgs>>;
  watchlist?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
}>;

export type SearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Movie' | 'Person', ParentType, ContextType>;
}>;

export type TomatometerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tomatometer'] = ResolversParentTypes['Tomatometer']> = ResolversObject<{
  consensus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TomatometerState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Movie?: MovieResolvers<ContextType>;
  MovieCredit?: MovieCreditResolvers<ContextType>;
  MovieInfo?: MovieInfoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginatedMovies?: PaginatedMoviesResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  PersonCredit?: PersonCreditResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  Tomatometer?: TomatometerResolvers<ContextType>;
}>;



export const GetFavouritePeopleDocument = gql`
    query GetFavouritePeople {
  favouritePeople {
    id
    profilePath
    name
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
 *   },
 * });
 */
export function useGetFavouritePeopleQuery(baseOptions?: Apollo.QueryHookOptions<GetFavouritePeopleQuery, GetFavouritePeopleQueryVariables>) {
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
    query GetLikedMovies {
  likedMovies {
    id
    title
    posterPath
    releaseDate
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
 *   },
 * });
 */
export function useGetLikedMoviesQuery(baseOptions?: Apollo.QueryHookOptions<GetLikedMoviesQuery, GetLikedMoviesQueryVariables>) {
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
export const GetWatchedMoviesDocument = gql`
    query GetWatchedMovies($offset: Int, $limit: Int) {
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
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetWatchedMoviesQuery(baseOptions?: Apollo.QueryHookOptions<GetWatchedMoviesQuery, GetWatchedMoviesQueryVariables>) {
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
    ... on Person {
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
    query GetTrendingMovies {
  trending {
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
 *   },
 * });
 */
export function useGetTrendingMoviesQuery(baseOptions?: Apollo.QueryHookOptions<GetTrendingMoviesQuery, GetTrendingMoviesQueryVariables>) {
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
    query GetRecommendedMovies {
  recommendedMovies {
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
 *   },
 * });
 */
export function useGetRecommendedMoviesQuery(baseOptions?: Apollo.QueryHookOptions<GetRecommendedMoviesQuery, GetRecommendedMoviesQueryVariables>) {
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
export const GetCreditsDocument = gql`
    query GetCredits($id: ID!) {
  creditsForMovie(id: $id) {
    id
    name
    profilePath
    jobs
  }
}
    `;

/**
 * __useGetCreditsQuery__
 *
 * To run a query within a React component, call `useGetCreditsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCreditsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCreditsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCreditsQuery(baseOptions: Apollo.QueryHookOptions<GetCreditsQuery, GetCreditsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCreditsQuery, GetCreditsQueryVariables>(GetCreditsDocument, options);
      }
export function useGetCreditsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCreditsQuery, GetCreditsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCreditsQuery, GetCreditsQueryVariables>(GetCreditsDocument, options);
        }
export type GetCreditsQueryHookResult = ReturnType<typeof useGetCreditsQuery>;
export type GetCreditsLazyQueryHookResult = ReturnType<typeof useGetCreditsLazyQuery>;
export type GetCreditsQueryResult = Apollo.QueryResult<GetCreditsQuery, GetCreditsQueryVariables>;
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
export const GetWatchlistDocument = gql`
    query GetWatchlist {
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
 *   },
 * });
 */
export function useGetWatchlistQuery(baseOptions?: Apollo.QueryHookOptions<GetWatchlistQuery, GetWatchlistQueryVariables>) {
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

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "SearchResult": [
      "Movie",
      "Person"
    ]
  }
};
      export default result;
    