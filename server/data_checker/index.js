const fs = require('fs');
const MovieDb = require('moviedb-promise');
const detailedDiff = require("deep-object-diff").detailedDiff;
const database = require('../database');
const merge = require('deepmerge');
const Converter = require('ansi-to-html');
const emailing = require('../emailing');


class DataChecker {
  constructor() {
    this.dataFile = 'server/data_checker/saved_data.json';
    if (!fs.existsSync(this.dataFile)) {
      fs.writeFileSync(this.dataFile, '[]');
    }

    this.moviedb = new MovieDb(fs.readFileSync('server/tmdbApiKey.txt', 'utf-8').trimRight());
    this.converter = new Converter({newline: true});
  }

  async getNewProjects() {
    const users = database.getUsers();
    const followedPeople = DataChecker.getFollowedPeople(users);
    const credits = await this.getCredits(followedPeople);
    const savedCredits = JSON.parse(fs.readFileSync(this.dataFile, 'utf-8'));
    const diff = detailedDiff(savedCredits, credits);
    this.printNewProjectInformation(users, diff, credits, savedCredits);

    fs.writeFileSync(this.dataFile, JSON.stringify(credits, null, 2));
  }

  static getFollowedPeople(users) {
    const followedPeople = {};

    for (let user of Object.keys(users)) {
      for (let person of users[user].followedPeople) {
        followedPeople[person.id] = person;
      }
    }
    return followedPeople;
  }

  getCredits(people) {
    const queries = [];

    for (let id in people) {
      queries.push(this.moviedb.personMovieCredits({"id": id})
        .then(data => data.crew.concat(data.cast))
        .then(DataChecker.convertMovieDataStructure)
        .then(data => people[id].projects = data)
        .catch(console.error));
    }

    return Promise.all(queries).then(() => people);
  }

  static convertMovieDataStructure(projects) {
    const updatedMovies = {};
    for (let project of projects) {
      project.jobs = [project.hasOwnProperty('job') ? project.job.toLowerCase() : 'actor'];
      updatedMovies[project.id] = merge(project, updatedMovies[project.id] || {});
    }
    return updatedMovies;
  }

  printNewProjectInformation(users, diff, credits, savedCredits) {
    let output = [];
    for (let user of Object.keys(users)) {
      for (let person of users[user].followedPeople) {
        output.push(`\x1b[33m====== ${person.name} ======\x1b[0m`);
        output = output.concat(DataChecker.getNewProjectsConsoleOutput(diff, person, credits));
        output = output.concat(DataChecker.getChangesConsoleOutput(diff, person, credits, savedCredits));
        output.push('', '');
      }
    }
    const html = "<html>\n<body>\n" + this.converter.toHtml(output.join('\n')) + "\n</body>\n</html>\n";

    emailing.Emailer.sendMail('daradermody@gmail.com', html)
      .catch(console.error);
  }

  static getNewProjectsConsoleOutput(diff, person, credits) {
    const output = [];

    if (diff.added.hasOwnProperty(person.id)) {
      const newProjects = [];
      for (let projectId in diff.added[person.id].projects) {
        if (diff.added[person.id].projects[projectId].hasOwnProperty('id')) {
          newProjects.push(projectId)
        }
      }
      if (newProjects) {
        for (let projectId of newProjects) {
          const project = credits[person.id].projects[projectId];
          output.push(`\x1b[32m&nbsp;&nbsp;${project.title}: ${project.release_date} (${project.jobs.join(', ')})\x1b[0m`);
        }
      }
    }
    return output;
  }

  static getChangesConsoleOutput(diff, person, credits, savedCredits) {
    const output = [];
    if (diff.updated.hasOwnProperty(person.id)) {
      for (let projectId in diff.updated[person.id].projects) {
        const projectDiff = diff.updated[person.id].projects[projectId];
        output.push(`\x1b[36m&nbsp;&nbsp;${credits[person.id].projects[projectId].title}: \x1b[0m`);
        for (let attribute in projectDiff) {
          output.push(`&nbsp;&nbsp;&nbsp;&nbsp;${attribute}: \x1b[31m${savedCredits[person.id].projects[projectId][attribute]}\x1b[0m => \x1b[32m${projectDiff[attribute]}\x1b[0m`);
        }
      }
    }
    return output;
  }

}

module.exports = new DataChecker();
