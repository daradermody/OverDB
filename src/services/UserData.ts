import * as fs from 'fs'
import {nanoid} from 'nanoid'
import {type List, type Movie, type Person, Sentiment, type UserSettingsInput} from '../../types'
import {type Movie as ApiMovie, ListType} from '../apiTypes'
import {dataDir} from './dataStorage'
import type {User} from './users'
import type {MovieWithUserMetadata, UserSettings} from '../apiTypes.ts'

interface Data {
  [username: string]: {
    favourites: Person['id'][];
    sentiments: Record<Movie['id'], Sentiment>;
    watched: Movie['id'][];
    lists: {
      [id: string]: StoredList;
      watchlist: MovieList;
    };
    settings: UserSettings;
  };
}

export type StoredList = MovieList | PersonList

interface MovieList {
  id: string;
  name: string;
  type: ListType.Movie;
  ids: string[];
}

interface PersonList {
  id: string;
  name: string;
  type: ListType.Person;
  ids: string[];
}

const emptyObject: Data[User['username']] = {
  favourites: [],
  sentiments: {},
  watched: [],
  lists: {
    watchlist: {id: 'watchlist', name: 'Watchlist', type: ListType.Movie, ids: []}
  },
  settings: {
    streaming: {
      providers: []
    }
  }
}

export class UserData {
  static FILE_PATH = `${dataDir}/user_data.json`
  private static data: Data = UserData.readCache()

  public static getFavourites(username: string): Person['id'][] {
    return UserData.forUser(username).favourites
  }

  public static setFavourite(username: string, personId: Person['id'], favourite: boolean): void {
    let favourites = UserData.forUser(username).favourites
    if (favourite) {
      favourites = Array.from(new Set([...favourites, personId]))
    } else {
      favourites = favourites.filter(id => id !== personId)
    }

    UserData.data[username] = {
      ...UserData.forUser(username),
      favourites,
    }
    UserData.save()
  }

  public static isFavourited(username: string, personId: Person['id']): boolean {
    return UserData.forUser(username).favourites.includes(personId)
  }

  static getLikedMovies(username: string): Movie['id'][] {
    return Object.entries(UserData.forUser(username).sentiments)
      .filter(([_, sentiment]) => sentiment === Sentiment.Liked)
      .map(([movieId, _]) => movieId)
  }

  static getSentiment(username: string, movieId: Movie['id']): Sentiment {
    return UserData.forUser(username).sentiments[movieId] || Sentiment.None
  }

  static setSentiment(username: string, movieId: Movie['id'], sentiment: Sentiment): void {
    if (sentiment === Sentiment.None) {
      delete UserData.forUser(username).sentiments[movieId]
    } else {
      UserData.forUser(username).sentiments[movieId] = sentiment
    }
    UserData.save()
  }

  static getWatched(username: string): string[] {
    return UserData.forUser(username).watched
  }

  static isWatched(username: string, movieId: Movie['id']): boolean {
    return UserData.forUser(username).watched.includes(movieId)
  }

  static setWatched(username: string, movieId: Movie['id'], isWatched: boolean): void {
    if (isWatched) {
      UserData.forUser(username).watched = Array.from(new Set([...UserData.forUser(username).watched, movieId]))
    } else {
      UserData.forUser(username).watched = UserData.forUser(username).watched.filter(id => id !== movieId)
    }
    UserData.save()
  }


  static getLists(username: string): StoredList[] {
    return Object.values(UserData.forUser(username).lists)
      .sort((a, b) => (a.id === 'watchlist' || a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1)
  }

  static getList(username: string, id: string | 'watchlist'): StoredList {
    if (!(id in UserData.forUser(username).lists)) {
      throw new Error(`List '${id}' does not exist`)
    }
    return UserData.forUser(username).lists[id]
  }

  static createList(username: string, {name, type}: {name: string; type: ListType}): StoredList {
    const id = nanoid(10)
    const newList = UserData.forUser(username).lists[id] = {id, name, type, ids: []}
    UserData.save()
    return newList
  }

  static deleteLists(username: string, ids: string[]): void {
    for (const id of ids) {
      delete UserData.forUser(username).lists[id]
    }
    UserData.save()
  }

  static updateList(username: string, id: string, {name}: {name: string}): StoredList {
    UserData.forUser(username).lists[id] = { ...UserData.forUser(username).lists[id], name }
    UserData.save()
    return UserData.forUser(username).lists[id]
  }

  static addToList(username: string, listId: string, itemId: Movie['id'] | Person['id']): StoredList {
    if (!(listId in UserData.forUser(username).lists)) {
      throw new Error(`List '${listId}' does not exist`)
    }
    UserData.forUser(username).lists[listId].ids = Array.from(new Set([
      ...UserData.forUser(username).lists[listId].ids,
      itemId
    ]))
    UserData.save()
    return UserData.forUser(username).lists[listId]
  }

  static removeFromList(username: string, listId: string, itemId: Movie['id'] | Person['id']): StoredList {
    if (!(listId in UserData.forUser(username).lists)) {
      throw new Error(`List '${listId}' does not exist`)
    }
    UserData.forUser(username).lists[listId].ids = UserData.forUser(username).lists[listId].ids.filter(id => id !== itemId)
    UserData.save()
    return UserData.forUser(username).lists[listId]
  }

  static getWatchlist(username: string): Movie['id'][] {
    return UserData.getList(username, 'watchlist').ids
  }

  static inWatchlist(username: string, movieId: Movie['id']): boolean {
    return UserData.getList(username, 'watchlist').ids.includes(movieId)
  }

  static setInWatchlist(username: string, movieId: Movie['id'], inWatchlist: boolean): void {
    if (inWatchlist) {
      UserData.forUser(username).lists.watchlist.ids = Array.from(new Set([...UserData.forUser(username).lists.watchlist.ids, movieId]))
    } else {
      UserData.forUser(username).lists.watchlist.ids = UserData.forUser(username).lists.watchlist.ids.filter(id => id !== movieId)
    }
    UserData.save()
  }

  static getSettings(username: string): UserSettings {
    return UserData.forUser(username).settings
  }

  static updateSettings(username: string, newSettings: UserSettingsInput): UserSettings {
    UserData.forUser(username).settings = mergeDeep(UserData.forUser(username).settings, newSettings) as UserSettings
    UserData.save()
    return UserData.forUser(username).settings
  }

  static addUserMetadataToMovie(username: string, movie: ApiMovie): MovieWithUserMetadata {
    return {
      ...movie,
      watched: UserData.isWatched(username, movie.id),
      inWatchlist: UserData.inWatchlist(username, movie.id),
      sentiment: UserData.getSentiment(username, movie.id)
    }
  }

  private static readCache(): Data {
    if (!fs.existsSync(UserData.FILE_PATH)) {
      fs.writeFileSync(UserData.FILE_PATH, '{}')
    }
    return JSON.parse(fs.readFileSync(UserData.FILE_PATH, 'utf-8'))
  }

  private static save() {
    fs.writeFileSync(UserData.FILE_PATH, JSON.stringify(UserData.data))
  }

  private static forUser(id: string) {
    if (!UserData.data[id]) {
      UserData.data[id] = emptyObject
      UserData.save()
    }
    return UserData.data[id]
  }
}

function mergeDeep(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}

function isObject(item: any): item is Object {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
