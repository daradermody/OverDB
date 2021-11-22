import * as fs from "fs";

interface Data {
  [userId: number]: {
    likes: number[];
    dislikes: number[];
  }
}

export class UserData {
  static FILE_PATH = `${__dirname}/user_data.json`
  private static data: Data = UserData.readCache();

  private static readCache(): Data {
    if (!fs.existsSync(UserData.FILE_PATH)) {
      fs.writeFileSync(UserData.FILE_PATH, '{}');
    }
    return JSON.parse(fs.readFileSync(UserData.FILE_PATH, 'utf-8'));
  }

  public static getLiked(userId: number): number[] {
    return UserData.data[userId]?.likes || [];
  }

  public static getDisliked(userId: number): number[] {
    return UserData.data[userId]?.dislikes || [];
  }

  public static addLike(userId: number, movieId: number) {
    UserData.data[userId] = {
      ...(UserData.data[userId] || { dislikes: [] }),
      likes: [...(UserData.data[userId]?.likes || []), movieId],
    };
    UserData.save();
  }

  public static addDislike(userId: number, movieId: number) {
    UserData.data[userId] = {
      ...(UserData.data[userId] || { likes: [] }),
      dislikes: [...(UserData.data[userId]?.dislikes || []), movieId],
    };
    UserData.save();
  }

  public static removeLike(userId: number, movieId: number) {
    UserData.data[userId] = {
      ...(UserData.data[userId] || { dislikes: [] }),
      likes: (UserData.data[userId]?.likes || []).filter(id => id !== movieId)
    };
    UserData.save();
  }

  public static removeDislike(userId: number, movieId: number) {
    UserData.data[userId] = {
      ...(UserData.data[userId] || { likes: [] }),
      dislikes: (UserData.data[userId]?.dislikes || []).filter(id => id !== movieId)
    };
    UserData.save();
  }

  private static save() {
    fs.writeFileSync(UserData.FILE_PATH, JSON.stringify(UserData.data));
  }
}
