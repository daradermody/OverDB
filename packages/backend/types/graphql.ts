import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  items: Array<MovieOrPerson>;
  name: Scalars['String']['output'];
  type: ListType;
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
  watchlist: PaginatedMovies;
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


export type UserWatchlistArgs = {
  filteredByProviders?: InputMaybe<Scalars['Boolean']['input']>;
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
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  MovieOrPerson: ( Movie ) | ( PersonInfo );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Person: ( CastCredit ) | ( CrewCredit ) | ( PersonInfo );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CastCredit: ResolverTypeWrapper<CastCredit>;
  CrewCredit: ResolverTypeWrapper<CrewCredit>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  List: ResolverTypeWrapper<Omit<List, 'items'> & { items: Array<ResolversTypes['MovieOrPerson']> }>;
  ListType: ListType;
  Movie: ResolverTypeWrapper<Movie>;
  MovieCredit: ResolverTypeWrapper<MovieCredit>;
  MovieInfo: ResolverTypeWrapper<MovieInfo>;
  MovieOrPerson: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['MovieOrPerson']>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginatedMovies: ResolverTypeWrapper<PaginatedMovies>;
  PaginatedPeople: ResolverTypeWrapper<PaginatedPeople>;
  Person: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Person']>;
  PersonInfo: ResolverTypeWrapper<PersonInfo>;
  Provider: ResolverTypeWrapper<Provider>;
  Query: ResolverTypeWrapper<{}>;
  Sentiment: Sentiment;
  Stats: ResolverTypeWrapper<Stats>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tomatometer: ResolverTypeWrapper<Tomatometer>;
  TomatometerState: TomatometerState;
  User: ResolverTypeWrapper<User>;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserSettingsInput: UserSettingsInput;
  UserStreamingSettings: ResolverTypeWrapper<UserStreamingSettings>;
  UserStreamingSettingsInput: UserStreamingSettingsInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CastCredit: CastCredit;
  CrewCredit: CrewCredit;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  List: Omit<List, 'items'> & { items: Array<ResolversParentTypes['MovieOrPerson']> };
  Movie: Movie;
  MovieCredit: MovieCredit;
  MovieInfo: MovieInfo;
  MovieOrPerson: ResolversUnionTypes<ResolversParentTypes>['MovieOrPerson'];
  Mutation: {};
  PaginatedMovies: PaginatedMovies;
  PaginatedPeople: PaginatedPeople;
  Person: ResolversInterfaceTypes<ResolversParentTypes>['Person'];
  PersonInfo: PersonInfo;
  Provider: Provider;
  Query: {};
  Stats: Stats;
  String: Scalars['String']['output'];
  Tomatometer: Tomatometer;
  User: User;
  UserSettings: UserSettings;
  UserSettingsInput: UserSettingsInput;
  UserStreamingSettings: UserStreamingSettings;
  UserStreamingSettingsInput: UserStreamingSettingsInput;
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

export type ListResolvers<ContextType = any, ParentType extends ResolversParentTypes['List'] = ResolversParentTypes['List']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['MovieOrPerson']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ListType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MovieResolvers<ContextType = any, ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imdbId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inWatchlist?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  overview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posterPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  providers?: Resolver<Array<ResolversTypes['Provider']>, ParentType, ContextType>;
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
  imdbId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  overview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posterPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  releaseDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tagline?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tomatometer?: Resolver<Maybe<ResolversTypes['Tomatometer']>, ParentType, ContextType>;
  voteAverage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MovieOrPersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['MovieOrPerson'] = ResolversParentTypes['MovieOrPerson']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Movie' | 'PersonInfo', ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addToList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationAddToListArgs, 'itemId' | 'listId'>>;
  createList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationCreateListArgs, 'name' | 'type'>>;
  deleteLists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteListsArgs, 'ids'>>;
  editList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationEditListArgs, 'id' | 'name'>>;
  removeFromList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationRemoveFromListArgs, 'itemId' | 'listId'>>;
  setFavourite?: Resolver<ResolversTypes['PersonInfo'], ParentType, ContextType, RequireFields<MutationSetFavouriteArgs, 'favourited' | 'id'>>;
  setInWatchlist?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationSetInWatchlistArgs, 'id' | 'inWatchlist'>>;
  setSentiment?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationSetSentimentArgs, 'id' | 'sentiment'>>;
  setWatched?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<MutationSetWatchedArgs, 'id' | 'watched'>>;
  updateUserSettings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType, RequireFields<MutationUpdateUserSettingsArgs, 'settings'>>;
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

export type ProviderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Provider'] = ResolversParentTypes['Provider']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  castForMovie?: Resolver<Array<ResolversTypes['CastCredit']>, ParentType, ContextType, RequireFields<QueryCastForMovieArgs, 'id'>>;
  creditsForPerson?: Resolver<Array<ResolversTypes['MovieCredit']>, ParentType, ContextType, RequireFields<QueryCreditsForPersonArgs, 'id'>>;
  crewForMovie?: Resolver<Array<ResolversTypes['CrewCredit']>, ParentType, ContextType, RequireFields<QueryCrewForMovieArgs, 'id'>>;
  movie?: Resolver<ResolversTypes['Movie'], ParentType, ContextType, RequireFields<QueryMovieArgs, 'id'>>;
  person?: Resolver<ResolversTypes['PersonInfo'], ParentType, ContextType, RequireFields<QueryPersonArgs, 'id'>>;
  recommendedMovies?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType, Partial<QueryRecommendedMoviesArgs>>;
  search?: Resolver<Array<ResolversTypes['MovieOrPerson']>, ParentType, ContextType, RequireFields<QuerySearchArgs, 'query'>>;
  settings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType>;
  streamingProviders?: Resolver<Array<ResolversTypes['Provider']>, ParentType, ContextType, RequireFields<QueryStreamingProvidersArgs, 'region'>>;
  trending?: Resolver<Array<ResolversTypes['MovieInfo']>, ParentType, ContextType, Partial<QueryTrendingArgs>>;
  upcoming?: Resolver<Array<ResolversTypes['Movie']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'username'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
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
  list?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<UserListArgs, 'id'>>;
  lists?: Resolver<Array<ResolversTypes['List']>, ParentType, ContextType, Partial<UserListsArgs>>;
  public?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  stats?: Resolver<ResolversTypes['Stats'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  watched?: Resolver<ResolversTypes['PaginatedMovies'], ParentType, ContextType, Partial<UserWatchedArgs>>;
  watchlist?: Resolver<ResolversTypes['PaginatedMovies'], ParentType, ContextType, Partial<UserWatchlistArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings']> = ResolversObject<{
  streaming?: Resolver<ResolversTypes['UserStreamingSettings'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserStreamingSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserStreamingSettings'] = ResolversParentTypes['UserStreamingSettings']> = ResolversObject<{
  providers?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CastCredit?: CastCreditResolvers<ContextType>;
  CrewCredit?: CrewCreditResolvers<ContextType>;
  List?: ListResolvers<ContextType>;
  Movie?: MovieResolvers<ContextType>;
  MovieCredit?: MovieCreditResolvers<ContextType>;
  MovieInfo?: MovieInfoResolvers<ContextType>;
  MovieOrPerson?: MovieOrPersonResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginatedMovies?: PaginatedMoviesResolvers<ContextType>;
  PaginatedPeople?: PaginatedPeopleResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  PersonInfo?: PersonInfoResolvers<ContextType>;
  Provider?: ProviderResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Stats?: StatsResolvers<ContextType>;
  Tomatometer?: TomatometerResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserStreamingSettings?: UserStreamingSettingsResolvers<ContextType>;
}>;

