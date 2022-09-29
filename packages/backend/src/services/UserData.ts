import * as fs from "fs";
import { Movie, Person, Sentiment, User } from '../../types'
import { dataDir } from './dataStorage'

interface Data {
  [userId: User['id']]: {
    favourites: Person['id'][];
    sentiments: Record<Movie['id'], Sentiment>;
    watched: Movie['id'][];
    watchlist: Movie['id'][];
  }
}

const emptyObject: Data[number] = {
  favourites: [],
  sentiments: {},
  watched: [],
  watchlist: [],
}

export class UserData {
  static FILE_PATH = `${dataDir}/user_data.json`
  private static data: Data = UserData.readCache();

  private static readCache(): Data {
    if (!fs.existsSync(UserData.FILE_PATH)) {
      fs.writeFileSync(UserData.FILE_PATH, '{}');
    }
    return JSON.parse(fs.readFileSync(UserData.FILE_PATH, 'utf-8'));
  }

  public static getFavourites(userId: User['id']): Person['id'][] {
    return UserData.forUser(userId).favourites;
  }

  public static setFavourite(userId: User['id'], personId: Person['id'], favourite: boolean): void {
    let favourites = UserData.forUser(userId).favourites
    if (favourite) {
      favourites = Array.from(new Set([...favourites, personId]))
    } else {
      favourites = favourites.filter(id => id !== personId)
    }

    UserData.data[userId] = {
      ...UserData.forUser(userId),
      favourites,
    };
    UserData.save();
  }

  public static isFavourited(userId: User['id'], personId: Person['id']): boolean {
    return UserData.forUser(userId).favourites.includes(personId);
  }

  static getSentiment(userId: User['id'], movieId: Movie['id']): Sentiment {
    return UserData.forUser(userId).sentiments[movieId] || Sentiment.None
  }

  static setSentiment(userId: User['id'], movieId: Movie['id'], sentiment: Sentiment): void {
    if (sentiment === Sentiment.None) {
      delete UserData.forUser(userId).sentiments[movieId]
    } else {
      UserData.forUser(userId).sentiments[movieId] = sentiment
    }
    UserData.save()
  }

  static getWatched(userId: User['id']): string[] {
    return UserData.forUser(userId).watched
  }

  static isWatched(userId: User['id'], movieId: Movie['id']): boolean {
    return UserData.forUser(userId).watched.includes(movieId)
  }

  static setWatched(userId: User['id'], movieId: Movie['id'], isWatched: boolean): void {
    if (isWatched) {
      UserData.forUser(userId).watched = Array.from(new Set([...UserData.forUser(userId).watched, movieId]))
    } else {
      UserData.forUser(userId).watched = UserData.forUser(userId).watched.filter(id => id !== movieId)
    }
    UserData.save()
  }

  static getWatchlist(userId: User['id']): Movie['id'][] {
    return UserData.forUser(userId).watchlist
  }

  static inWatchlist(userId: User['id'], movieId: Movie['id']): boolean {
    return UserData.forUser(userId).watchlist.includes(movieId)
  }

  static setInWatchlist(userId: User['id'], movieId: Movie['id'], inWatchlist: boolean): void {
    if (inWatchlist) {
      UserData.forUser(userId).watchlist = Array.from(new Set([...UserData.forUser(userId).watchlist, movieId]))
    } else {
      UserData.forUser(userId).watchlist = UserData.forUser(userId).watchlist.filter(id => id !== movieId)
    }
    UserData.save()
  }

  private static save() {
    fs.writeFileSync(UserData.FILE_PATH, JSON.stringify(UserData.data));
  }

  private static forUser(id: User['id']) {
    if (!UserData.data[id]) {
      UserData.data[id] = emptyObject
      UserData.save()
    }
    return UserData.data[id]
  }
}
