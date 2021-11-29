import * as fs from "fs";
import {Sentiment} from "./types";

interface Data {
  [userId: number]: {
    favourites: number[];
    sentiments: Record<number, Sentiment>;
    watched: number[];
    watchlist: number[];
  }
}

const emptyObject: Data[0] = {
  favourites: [],
  sentiments: [],
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

  public static getFavourites(userId: number): number[] {
    return UserData.data[userId]?.favourites || [];
  }

  public static addFavourite(userId: number, personId: number) {
    UserData.data[userId] = {
      ...(UserData.data[userId] || emptyObject),
      favourites: Array.from(new Set([...(UserData.data[userId]?.favourites || []), personId])),
    };
    UserData.save();
  }

  public static isFavourited(userId: number, personId: number) {
    return UserData.data[userId].favourites.includes(personId);
  }

  public static removeFavourite(userId: number, personId: number) {
    UserData.data[userId] = {
      ...(UserData.data[userId] || emptyObject),
      favourites: (UserData.data[userId]?.favourites || []).filter(id => id !== personId)
    };
    UserData.save();
  }

  static getSentiment(userId: number, movieId: number): Sentiment {
    return UserData.data[userId].sentiments[movieId] || Sentiment.NONE
  }

  static setSentiment(userId: number, movieId: number, sentiment: Sentiment): void {
    if (sentiment === Sentiment.NONE) {
      delete UserData.data[userId].sentiments[movieId]
    } else {
      UserData.data[userId].sentiments[movieId] = sentiment
    }
    UserData.save()
  }

  static getWatched(userId: number): number[] {
    return UserData.data[userId].watched
  }

  static isWatched(userId: number, movieId: number): boolean {
    return UserData.data[userId].watched.includes(movieId)
  }

  static setWatched(userId: number, movieId: number, isWatched: boolean): void {
    if (isWatched) {
      UserData.data[userId].watched = Array.from(new Set([...UserData.data[userId].watched, movieId]))
    } else {
      UserData.data[userId].watched = UserData.data[userId].watched.filter(id => id !== movieId)
    }
    UserData.save()
  }

  static getWatchlist(userId: number): number[] {
    return UserData.data[userId].watchlist
  }

  static inWatchlist(userId: number, movieId: number): boolean {
    return UserData.data[userId].watchlist.includes(movieId)
  }

  static setInWatchlist(userId: number, movieId: number, inWatchlist: boolean): void {
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
