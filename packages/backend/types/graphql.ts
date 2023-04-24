import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  inWatchlist?: Maybe<Scalars['Boolean']>;
  overview: Scalars['String'];
  posterPath?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['String']>;
  sentiment?: Maybe<Sentiment>;
  tagline: Scalars['String'];
  title: Scalars['String'];
  tomatometer?: Maybe<Tomatometer>;
  voteAverage: Scalars['Float'];
  watched?: Maybe<Scalars['Boolean']>;
};

export type MovieCredit = {
  __typename?: 'MovieCredit';
  character?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inWatchlist?: Maybe<Scalars['Boolean']>;
  jobs: Array<Scalars['String']>;
  posterPath?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['String']>;
  sentiment?: Maybe<Sentiment>;
  title: Scalars['String'];
  watched?: Maybe<Scalars['Boolean']>;
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

export type PaginatedPeople = {
  __typename?: 'PaginatedPeople';
  endReached: Scalars['Boolean'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  results: Array<PersonInfo>;
};

export type Person = {
  id: Scalars['ID'];
  name: Scalars['String'];
  profilePath?: Maybe<Scalars['String']>;
};

export type PersonInfo = Person & {
  __typename?: 'PersonInfo';
  biography?: Maybe<Scalars['String']>;
  favourited?: Maybe<Scalars['Boolean']>;
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
  users: Array<User>;
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
  favouritePeople: PaginatedPeople;
  isAdmin?: Maybe<Scalars['Boolean']>;
  likedMovies: PaginatedMovies;
  public?: Maybe<Scalars['Boolean']>;
  stats: Stats;
  username: Scalars['String'];
  watched: PaginatedMovies;
  watchlist: PaginatedMovies;
};


export type UserFavouritePeopleArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type UserLikedMoviesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type UserWatchedArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type UserWatchlistArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

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

/** Mapping of union types */
export type ResolversUnionTypes = ResolversObject<{
  SearchResult: ( Movie ) | ( PersonInfo );
}>;

/** Mapping of union parent types */
export type ResolversUnionParentTypes = ResolversObject<{
  SearchResult: ( Movie ) | ( PersonInfo );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CastCredit: ResolverTypeWrapper<CastCredit>;
  CrewCredit: ResolverTypeWrapper<CrewCredit>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Movie: ResolverTypeWrapper<Movie>;
  MovieCredit: ResolverTypeWrapper<MovieCredit>;
  MovieInfo: ResolverTypeWrapper<MovieInfo>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginatedMovies: ResolverTypeWrapper<PaginatedMovies>;
  PaginatedPeople: ResolverTypeWrapper<PaginatedPeople>;
  Person: ResolversTypes['CastCredit'] | ResolversTypes['CrewCredit'] | ResolversTypes['PersonInfo'];
  PersonInfo: ResolverTypeWrapper<PersonInfo>;
  Query: ResolverTypeWrapper<{}>;
  SearchResult: ResolverTypeWrapper<ResolversUnionTypes['SearchResult']>;
  Sentiment: Sentiment;
  Stats: ResolverTypeWrapper<Stats>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tomatometer: ResolverTypeWrapper<Tomatometer>;
  TomatometerState: TomatometerState;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  CastCredit: CastCredit;
  CrewCredit: CrewCredit;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Movie: Movie;
  MovieCredit: MovieCredit;
  MovieInfo: MovieInfo;
  Mutation: {};
  PaginatedMovies: PaginatedMovies;
  PaginatedPeople: PaginatedPeople;
  Person: ResolversParentTypes['CastCredit'] | ResolversParentTypes['CrewCredit'] | ResolversParentTypes['PersonInfo'];
  PersonInfo: PersonInfo;
  Query: {};
  SearchResult: ResolversUnionParentTypes['SearchResult'];
  Stats: Stats;
  String: Scalars['String'];
  Tomatometer: Tomatometer;
  User: User;
}>;

export type CastCreditResolvers<ContextType = any, ParentType extends ResolversParentTypes['CastCredit'] = ResolversParentTypes['CastCredit']> = ResolversObject<{
  character?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  profilePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CrewCreditResolvers<ContextType = any, ParentType extends ResolversParentTypes['CrewCredit'] = ResolversParentTypes['CrewCredit']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profilePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MovieResolvers<ContextType = any, ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inWatchlist?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  overview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posterPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  releaseDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sentiment?: Resolver<Maybe<ResolversTypes['Sentiment']>, ParentType, ContextType>;
  tagline?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tomatometer?: Resolver<Maybe<ResolversTypes['Tomatometer']>, ParentType, ContextType>;
  voteAverage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  watched?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MovieCreditResolvers<ContextType = any, ParentType extends ResolversParentTypes['MovieCredit'] = ResolversParentTypes['MovieCredit']> = ResolversObject<{
  character?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inWatchlist?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  jobs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  posterPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  releaseDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sentiment?: Resolver<Maybe<ResolversTypes['Sentiment']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  watched?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
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
  setFavourite?: Resolver<ResolversTypes['PersonInfo'], ParentType, ContextType, RequireFields<MutationSetFavouriteArgs, 'favourited' | 'id'>>;
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

export type PaginatedPeopleResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedPeople'] = ResolversParentTypes['PaginatedPeople']> = ResolversObject<{
  endReached?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['PersonInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CastCredit' | 'CrewCredit' | 'PersonInfo', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profilePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type PersonInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonInfo'] = ResolversParentTypes['PersonInfo']> = ResolversObject<{
  biography?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  favourited?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  knownForDepartment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profilePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  castForMovie?: Resolver<Array<ResolversTypes['CastCredit']>, ParentType, ContextType, RequireFields<QueryCastForMovieArgs, 'id'>>;
  creditsForPerson?: Resolver<Array<ResolversTypes['MovieCredit']>, ParentType, ContextType, RequireFields<QueryCreditsForPersonArgs, 'id'>>;
  crewForMovie?: Resolver<Array<ResolversTypes['CrewCredit']>, ParentType, ContextType, RequireFields<QueryCrewForMovieArgs, 'id'>>;
  movie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<QueryMovieArgs, 'id'>>;
  person?: Resolver<ResolversTypes['PersonInfo'], ParentType, ContextType, RequireFields<QueryPersonArgs, 'id'>>;
  recommendedMovies?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType, Partial<QueryRecommendedMoviesArgs>>;
  search?: Resolver<Array<ResolversTypes['SearchResult']>, ParentType, ContextType, RequireFields<QuerySearchArgs, 'query'>>;
  trending?: Resolver<Array<ResolversTypes['MovieInfo']>, ParentType, ContextType, Partial<QueryTrendingArgs>>;
  upcoming?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'username'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type SearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Movie' | 'PersonInfo', ParentType, ContextType>;
}>;

export type StatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Stats'] = ResolversParentTypes['Stats']> = ResolversObject<{
  favouritePeople?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  moviesLiked?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  watched?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  watchlist?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TomatometerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tomatometer'] = ResolversParentTypes['Tomatometer']> = ResolversObject<{
  consensus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['TomatometerState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  favouritePeople?: Resolver<ResolversTypes['PaginatedPeople'], ParentType, ContextType, Partial<UserFavouritePeopleArgs>>;
  isAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  likedMovies?: Resolver<ResolversTypes['PaginatedMovies'], ParentType, ContextType, Partial<UserLikedMoviesArgs>>;
  public?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  stats?: Resolver<ResolversTypes['Stats'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  watched?: Resolver<ResolversTypes['PaginatedMovies'], ParentType, ContextType, Partial<UserWatchedArgs>>;
  watchlist?: Resolver<ResolversTypes['PaginatedMovies'], ParentType, ContextType, Partial<UserWatchlistArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CastCredit?: CastCreditResolvers<ContextType>;
  CrewCredit?: CrewCreditResolvers<ContextType>;
  Movie?: MovieResolvers<ContextType>;
  MovieCredit?: MovieCreditResolvers<ContextType>;
  MovieInfo?: MovieInfoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginatedMovies?: PaginatedMoviesResolvers<ContextType>;
  PaginatedPeople?: PaginatedPeopleResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  PersonInfo?: PersonInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  Stats?: StatsResolvers<ContextType>;
  Tomatometer?: TomatometerResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

