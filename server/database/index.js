const fs = require('fs');


class Storage {
  constructor() {
    this.userFile = __dirname + '/user_data.json';
  }

  getUserInfo(user, usersInfo) {
    if (!(user in usersInfo)) {
      throw new Error(`User ${user} does not exist`);
    }
    return usersInfo[user];
  }

  getFollowedPeople(user) {
    const usersInfo = JSON.parse(fs.readFileSync(this.userFile, 'utf-8'));
    return this.getUserInfo(user, usersInfo).followedPeople;
  }

  addFollowedPerson(person, user) {
    const usersInfo = JSON.parse(fs.readFileSync(this.userFile, 'utf-8'));
    const userInfo = this.getUserInfo(user, usersInfo);

    if (userInfo.followedPeople.find((p) => p.name === person.name)) {
      throw new Error('Person already followed!');
    } else {
      userInfo.followedPeople.push(person);
      fs.writeFileSync(this.userFile, JSON.stringify(usersInfo, null, 2), 'utf-8');
    }
  }

  removeFollowedPerson(person, user) {
    const usersInfo = JSON.parse(fs.readFileSync(this.userFile, 'utf-8'));
    const userInfo = this.getUserInfo(user, usersInfo);

    const index = userInfo.followedPeople.findIndex((p) => p.name === person);
    if (index === -1) {
      throw new Error('Person wasn\'t followed anyway!');
    } else {
      userInfo.followedPeople.splice(index, 1);
      fs.writeFileSync(this.userFile, JSON.stringify(usersInfo, null, 2), 'utf-8');
    }
  }
}

module.exports = new Storage();
