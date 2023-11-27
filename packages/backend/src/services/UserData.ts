import * as fs from 'fs'
import { nanoid } from 'nanoid'
import { List, ListType, Movie, Person, Sentiment, UserSettings, UserSettingsInput } from '../../types'
import { dataDir } from './dataStorage'
import { User } from './users'

interface Data {
  [username: User['username']]: {
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
  id: List['id'];
  name: List['name'];
  type: ListType.Movie;
  ids: Movie['id'][];
}

interface PersonList {
  id: List['id'];
  name: List['name'];
  type: ListType.Person;
  ids: Person['id'][];
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

  public static getFavourites(username: User['username']): Person['id'][] {
    return UserData.forUser(username).favourites
  }

  public static setFavourite(username: User['username'], personId: Person['id'], favourite: boolean): void {
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

  public static isFavourited(username: User['username'], personId: Person['id']): boolean {
    return UserData.forUser(username).favourites.includes(personId)
  }

  static getLikedMovies(username: User['username']): Movie['id'][] {
    return Object.entries(UserData.forUser(username).sentiments)
      .filter(([_, sentiment]) => sentiment === Sentiment.Liked)
      .map(([movieId, _]) => movieId)
  }

  static getSentiment(username: User['username'], movieId: Movie['id']): Sentiment {
    return UserData.forUser(username).sentiments[movieId] || Sentiment.None
  }

  static setSentiment(username: User['username'], movieId: Movie['id'], sentiment: Sentiment): void {
    if (sentiment === Sentiment.None) {
      delete UserData.forUser(username).sentiments[movieId]
    } else {
      UserData.forUser(username).sentiments[movieId] = sentiment
    }
    UserData.save()
  }

  static getWatched(username: User['username']): string[] {
    return UserData.forUser(username).watched
  }

  static isWatched(username: User['username'], movieId: Movie['id']): boolean {
    return UserData.forUser(username).watched.includes(movieId)
  }

  static setWatched(username: User['username'], movieId: Movie['id'], isWatched: boolean): void {
    if (isWatched) {
      UserData.forUser(username).watched = Array.from(new Set([...UserData.forUser(username).watched, movieId]))
    } else {
      UserData.forUser(username).watched = UserData.forUser(username).watched.filter(id => id !== movieId)
    }
    UserData.save()
  }


  static getLists(username: User['username']): StoredList[] {
    return Object.values(UserData.forUser(username).lists)
      .sort((a, b) => (a.id === 'watchlist' || a.name < b.name) ? -1 : 1)
  }

  static getList(username: User['username'], id: List['id'] | 'watchlist'): StoredList {
    if (!(id in UserData.forUser(username).lists)) {
      throw new Error(`List '${id}' does not exist`)
    }
    return UserData.forUser(username).lists[id]
  }

  static createList(username: User['username'], {name, type}: {name: List['name']; type: ListType}): StoredList {
    const id = nanoid(10)
    const newList = UserData.forUser(username).lists[id] = {id, name, type, ids: []}
    UserData.save()
    return newList
  }

  static deleteLists(username: User['username'], ids: List['id'][]): void {
    for (const id of ids) {
      delete UserData.forUser(username).lists[id]
    }
    UserData.save()
  }

  static updateList(username: User['username'], id: List['id'], {name}: {name: List['name']}): StoredList {
    UserData.forUser(username).lists[id] = { ...UserData.forUser(username).lists[id], name }
    UserData.save()
    return UserData.forUser(username).lists[id]
  }

  static addToList(username: User['username'], listId: List['id'], itemId: Movie['id'] | Person['id']): StoredList {
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

  static removeFromList(username: User['username'], listId: List['id'], itemId: Movie['id'] | Person['id']): StoredList {
    if (!(listId in UserData.forUser(username).lists)) {
      throw new Error(`List '${listId}' does not exist`)
    }
    UserData.forUser(username).lists[listId].ids = UserData.forUser(username).lists[listId].ids.filter(id => id !== itemId)
    UserData.save()
    return UserData.forUser(username).lists[listId]
  }

  static getWatchlist(username: User['username']): Movie['id'][] {
    return UserData.getList(username, 'watchlist').ids
  }

  static inWatchlist(username: User['username'], movieId: Movie['id']): boolean {
    return UserData.getList(username, 'watchlist').ids.includes(movieId)
  }

  static setInWatchlist(username: User['username'], movieId: Movie['id'], inWatchlist: boolean): void {
    if (inWatchlist) {
      UserData.forUser(username).lists.watchlist.ids = Array.from(new Set([...UserData.forUser(username).lists.watchlist.ids, movieId]))
    } else {
      UserData.forUser(username).lists.watchlist.ids = UserData.forUser(username).lists.watchlist.ids.filter(id => id !== movieId)
    }
    UserData.save()
  }

  static getSettings(username: User['username']): UserSettings {
    return UserData.forUser(username).settings
  }

  static updateSettings(username: User['username'], newSettings: UserSettingsInput): UserSettings {
    UserData.forUser(username).settings = mergeDeep(UserData.forUser(username).settings, newSettings) as UserSettings
    UserData.save()
    return UserData.forUser(username).settings
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

  private static forUser(id: User['username']) {
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
