import * as fs from 'fs';
import {detailedDiff} from 'deep-object-diff';
import {FamousPerson, Storage, UserData} from '../database';
import * as merge from 'deepmerge';
import * as _ from 'lodash';
import * as emailing from '../emailing';
import * as moment from 'moment';

const MovieDb = require('moviedb-promise');
const Converter = require('ansi-to-html');


interface Project {
  id: number;
  title: string
  release_date: string
  job: string;
  jobs: string[];
}

export class DataChecker {
  private static readonly dataFile = 'server/data_checker/saved_data.json';
  private moviedb;
  private converter;

  constructor() {
    if (!fs.existsSync(DataChecker.dataFile)) {
      fs.writeFileSync(DataChecker.dataFile, '[]');
    }

    this.moviedb = new MovieDb(fs.readFileSync('server/tmdbApiKey.txt', 'utf-8').trimRight());
    this.converter = new Converter({newline: true});
  }

  async getNewProjects() {
    const users = Storage.getUsers();
    const followedPeople = DataChecker.getFollowedPeople(users);
    const credits = await this.getFutureCredits(followedPeople);
    const savedCredits: { [id: string]: Project } = JSON.parse(fs.readFileSync(DataChecker.dataFile, 'utf-8'));
    const diff = detailedDiff(savedCredits, credits);
    this.printNewProjectInformation(users, diff, credits, savedCredits);

    fs.writeFileSync(DataChecker.dataFile, JSON.stringify(credits, null, 2));
  }

  private static getFollowedPeople(users: UserData): { [name: string]: FamousPerson } {
    const followedPeople = {};

    for (let user of Object.keys(users)) {
      for (let person of users[user].followedPeople) {
        followedPeople[person.id] = person;
      }
    }
    return followedPeople;
  }

  private getFutureCredits(people: { [name: string]: FamousPerson }): Promise<{ [name: string]: FamousPerson }> {
    const queries = [];

    for (let id in people) {
      queries.push(
        this.moviedb.personMovieCredits({'id': id})
          .then(data => data.crew.concat(data.cast))
          .then(DataChecker.filterData)
          .then(DataChecker.convertMovieDataStructure)
          .then(data => people[id].projects = data)
      );
    }

    return Promise.all(queries)
      .then(() => people)
      .catch(error => {
        error.message = 'Could not get projects for followed people: ' + error.message;
        throw error;
      });
  }

  private static filterData(projects: Project[]): Project[] {
    const now = moment();
    return projects
      .filter(project => !project.release_date || moment(project.release_date) > now)
      .map(project => <Project>_.pick(project, ['id', 'job', 'release_date', 'title']));
  }

  private static convertMovieDataStructure(projects: Project[]): { [id: string]: Project } {
    const updatedMovies = {};
    for (let project of projects) {
      project.jobs = [project.hasOwnProperty('job') ? project.job.toLowerCase() : 'actor'];
      updatedMovies[project.id] = merge(project, updatedMovies[project.id] || {});
    }
    return updatedMovies;
  }

  private printNewProjectInformation(users: UserData, diff, credits: { [name: string]: FamousPerson }, savedCredits: { [id: string]: Project }) {
    let output = [];
    for (let user of Object.keys(users)) {
      for (let person of users[user].followedPeople) {
        const newProjects = DataChecker.getNewProjectsConsoleOutput(diff, person, credits);
        const changedProjects = DataChecker.getChangesConsoleOutput(diff, person, credits, savedCredits);
        if (newProjects.length || changedProjects.length) {
          output.push(`\x1b[33m====== ${person.name} ======\x1b[0m`);
          output = output.concat(newProjects);
          output = output.concat(changedProjects);
          output.push('');
        }
      }
    }

    if (output.length) {
      const html = "<html>\n<body>\n" + this.converter.toHtml(output.join('\n')) + "\n</body>\n</html>\n";
      emailing.Emailer.sendMail('daradermody@gmail.com', html)
        .catch(console.error);
    }
  }

  private static getNewProjectsConsoleOutput(diff, person, credits) {
    const output = [];

    if (diff.added.hasOwnProperty(person.id)) {
      const newProjects = [];
      for (let projectId in diff.added[person.id].projects) {
        if (diff.added[person.id].projects[projectId].hasOwnProperty('id')) {
          newProjects.push(projectId);
        }
      }
      if (newProjects) {
        for (let projectId of newProjects) {
          const project = credits[person.id].projects[projectId];
          output.push(`\x1b[32m&nbsp;&nbsp;${project.title}: ${project.release_date || 'TBD'} (${project.jobs.join(', ')})\x1b[0m`);
        }
      }
    }
    return output;
  }

  private static getChangesConsoleOutput(diff, person, credits, savedCredits) {
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
