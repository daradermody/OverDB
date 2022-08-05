import * as fs from "fs";
import {Movie, Person, Sentiment} from "./generated/graphql";

interface Data {
  [userId: number]: {
    favourites: Person['id'][];
    sentiments: Record<Movie['id'], Sentiment>;
    watched: Movie['id'][];
    watchlist: Movie['id'][];
  }
}

const emptyObject: Data[0] = {
  favourites: [],
  sentiments: {},
  watched: [],
  watchlist: [],
}

export class UserData {
  static FILE_PATH = `${__dirname}/data/user_data.json`
  private static data: Data = UserData.readCache();

  private static readCache(): Data {
    if (!fs.existsSync(UserData.FILE_PATH)) {
      fs.writeFileSync(UserData.FILE_PATH, '{}');
    }
    return JSON.parse(fs.readFileSync(UserData.FILE_PATH, 'utf-8'));
  }

  public static getFavourites(userId: number): Person['id'][] {
    return UserData.data[userId]?.favourites || [];
  }

  public static setFavourite(userId: number, personId: Person['id'], favourite: boolean): void {
    let favourites = UserData.data[userId]?.favourites || []
    if (favourite) {
      favourites = Array.from(new Set([...favourites, personId]))
    } else {
      favourites = favourites.filter(id => id !== personId)
    }

    UserData.data[userId] = {
      ...(UserData.data[userId] || emptyObject),
      favourites,
    };
    UserData.save();
  }

  public static addFavourite(userId: number, personId: Person['id']): void {
    UserData.data[userId] = {
      ...(UserData.data[userId] || emptyObject),
      favourites: Array.from(new Set([...(UserData.data[userId]?.favourites || []), personId])),
    };
    UserData.save();
  }

  public static isFavourited(userId: number, personId: Person['id']): boolean {
    return UserData.data[userId].favourites.includes(personId);
  }

  public static removeFavourite(userId: number, personId: Person['id']): void {
    UserData.data[userId] = {
      ...(UserData.data[userId] || emptyObject),
      favourites: (UserData.data[userId]?.favourites || []).filter(id => id !== personId)
    };
    UserData.save();
  }

  static getSentiment(userId: number, movieId: Movie['id']): Sentiment {
    return UserData.data[userId].sentiments[movieId] || Sentiment.None
  }

  static setSentiment(userId: number, movieId: Movie['id'], sentiment: Sentiment): void {
    if (sentiment === Sentiment.None) {
      delete UserData.data[userId].sentiments[movieId]
    } else {
      UserData.data[userId].sentiments[movieId] = sentiment
    }
    UserData.save()
  }

  static getWatched(userId: number): string[] {
    return UserData.data[userId].watched
  }

  static isWatched(userId: number, movieId: Movie['id']): boolean {
    return UserData.data[userId].watched.includes(movieId)
  }

  static setWatched(userId: number, movieId: Movie['id'], isWatched: boolean): void {
    if (isWatched) {
      UserData.data[userId].watched = Array.from(new Set([...UserData.data[userId].watched, movieId]))
    } else {
      UserData.data[userId].watched = UserData.data[userId].watched.filter(id => id !== movieId)
    }
    UserData.save()
  }

  static getWatchlist(userId: number): Movie['id'][] {
    return UserData.data[userId].watchlist
  }

  static inWatchlist(userId: number, movieId: Movie['id']): boolean {
    return UserData.data[userId].watchlist.includes(movieId)
  }

  static setInWatchlist(userId: number, movieId: Movie['id'], inWatchlist: boolean): void {
    if (inWatchlist) {
      UserData.data[userId].watchlist = Array.from(new Set([...UserData.data[userId].watchlist, movieId]))
    } else {
      UserData.data[userId].watchlist = UserData.data[userId].watchlist.filter(id => id !== movieId)
    }
    UserData.save()
  }



  private static save() {
    fs.writeFileSync(UserData.FILE_PATH, JSON.stringify(UserData.data));
  }
}
