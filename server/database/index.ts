import * as fs from 'fs';

export interface UserData {
  [name: string]: UserInfo
}

export interface UserInfo {
  followedPeople: FamousPerson[]
}

export interface FamousPerson {
  name: string,
  profile_path: string,
  id: number,
  projects: any;
}

export class Storage {
  private static readonly userFile = __dirname + '/user_data.json';

  static getUsers(): UserData {
    return JSON.parse(fs.readFileSync(Storage.userFile, 'utf-8'));
  }

  static getUserInfo(user: string, usersInfo: UserData): UserInfo {
    if (!(user in usersInfo)) {
      throw new Error(`User ${user} does not exist`);
    }
    return usersInfo[user];
  }

  static getFollowedPeople(user: string): FamousPerson[] {
    return Storage.getUserInfo(user, Storage.getUsers()).followedPeople;
  }

  static addFollowedPerson(user: string, person: FamousPerson) {
    const usersInfo = Storage.getUsers();
    const userInfo = Storage.getUserInfo(user, usersInfo);

    if (userInfo.followedPeople.find((p) => p.name === person.name)) {
      throw new Error('Person already followed!');
    } else {
      userInfo.followedPeople.push(person);
      fs.writeFileSync(Storage.userFile, JSON.stringify(usersInfo, null, 2), 'utf-8');
    }
  }

  static removeFollowedPerson(user: string, personName: string) {
    const usersInfo = Storage.getUsers();
    const userInfo = Storage.getUserInfo(user, usersInfo);

    const index = userInfo.followedPeople.findIndex((p) => p.name === personName);
    if (index === -1) {
      throw new Error('Person wasn\'t followed anyway!');
    } else {
      userInfo.followedPeople.splice(index, 1);
      fs.writeFileSync(Storage.userFile, JSON.stringify(usersInfo, null, 2), 'utf-8');
    }
  }
}
