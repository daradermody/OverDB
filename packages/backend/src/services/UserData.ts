import * as fs from 'fs'
import { Movie, Person, Sentiment } from '../../types'
import { dataDir } from './dataStorage'
import { User } from './users'

interface Data {
  [username: User['username']]: {
    favourites: Person['id'][];
    sentiments: Record<Movie['id'], Sentiment>;
    watched: Movie['id'][];
    watchlist: Movie['id'][];
  }
}

const emptyObject: Data[User['username']] = {
  favourites: [],
  sentiments: {},
  watched: [],
  watchlist: [],
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

  static getWatchlist(username: User['username']): Movie['id'][] {
    return UserData.forUser(username).watchlist
  }

  static inWatchlist(username: User['username'], movieId: Movie['id']): boolean {
    return UserData.forUser(username).watchlist.includes(movieId)
  }

  static setInWatchlist(username: User['username'], movieId: Movie['id'], inWatchlist: boolean): void {
    if (inWatchlist) {
      UserData.forUser(username).watchlist = Array.from(new Set([...UserData.forUser(username).watchlist, movieId]))
    } else {
      UserData.forUser(username).watchlist = UserData.forUser(username).watchlist.filter(id => id !== movieId)
    }
    UserData.save()
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
