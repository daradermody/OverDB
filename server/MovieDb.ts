import {MovieDb as MovieDbApi} from "moviedb-promise";
import * as fs from "fs";
import {pick} from "lodash";
import {Crew, MovieResponse, Person as MovieDbPerson, PersonMovieCreditsResponse, SearchMultiRequest} from "moviedb-promise/dist/request-types";
import {Movie, MovieCreditForPerson, Person, PersonCreditForMovie} from "./types";

const key = fs.readFileSync(`${__dirname}/tmdbApikey.txt`, 'utf-8').trim()

interface Cache {
  movieInfo: {
    [movieId: string]: Movie;
  }
  movieCredits: {
    [movieId: string]: PersonCreditForMovie[];
  }
  personMovieCredits: {
    [personId: string]: {
      id: Movie['id']
      jobs: MovieCreditForPerson['jobs']
    }[];
  }
  personInfo: {
    [personId: string]: Person
  },
}

export default class MovieDb {
  private static movieDbApi = new MovieDbApi(key);
  static FILE_PATH = `${__dirname}/data/moviedb_cache.json`
  private static cache: Cache = MovieDb.readCache();

  private static readCache(): Cache {
    if (!fs.existsSync(MovieDb.FILE_PATH)) {
      const initial: Cache = {personInfo: {}, movieCredits: {}, personMovieCredits: {}, movieInfo: {}};
      fs.writeFileSync(MovieDb.FILE_PATH, JSON.stringify(initial));
    }
    return JSON.parse(fs.readFileSync(MovieDb.FILE_PATH, 'utf-8'));
  }

  static async searchPerson(params: SearchMultiRequest) {
    return MovieDb.movieDbApi.searchPerson(params)
  }

  static async personMovieCredits(id: number): Promise<{ id: Movie['id'], jobs: MovieCreditForPerson['jobs'] }[]> {
    if (!MovieDb.cache.personMovieCredits[id]) {
      const {crew} = await MovieDb.movieDbApi.personMovieCredits(id) as { crew: Required<PersonMovieCreditsResponse['crew'][0]>[] };
      const filteredMovies = filterInvalidMovies(crew)
      MovieDb.cache.personMovieCredits[id] = aggregateAndNormalizeJobs(filteredMovies)
        .map(m => ({id: m.id, jobs: m.jobs}));
      MovieDb.save();
    }
    return MovieDb.cache.personMovieCredits[id]
  }

  static async personInfo(id: number): Promise<Person> {
    if (!MovieDb.cache.personInfo[id]) {
      const person = await MovieDb.movieDbApi.personInfo(id);
      MovieDb.cache.personInfo[id] = pickPersonProperties(person);
      MovieDb.save();
    }
    return MovieDb.cache.personInfo[id];
  }

  static async movieInfo(id: number): Promise<Movie> {
    if (!MovieDb.cache.movieInfo[id]) {
      const movie = await MovieDb.movieDbApi.movieInfo(id);
      MovieDb.cache.movieInfo[id] = pickMovieProperties(movie);
      MovieDb.save();
    }
    return MovieDb.cache.movieInfo[id]
  }

  static async movieCredits(id: number): Promise<PersonCreditForMovie[]> {
    if (!MovieDb.cache.movieCredits[id]) {
      const {crew} = await MovieDb.movieDbApi.movieCredits(id) as { crew: Required<Crew>[] };
      const filteredCredits = filterInsignificantPeople(crew)
      const aggregatedCredits = aggregateAndNormalizeJobs(filteredCredits)
      MovieDb.cache.movieCredits[id] = aggregatedCredits
        .map(pickPersonCreditForMovieProperties)
        .sort(sortByRole)
      MovieDb.save();
    }
    return MovieDb.cache.movieCredits[id]
  }

  static save() {
    fs.writeFileSync(MovieDb.FILE_PATH, JSON.stringify(MovieDb.cache));
  }
}

function filterInvalidMovies<T extends { vote_count: number, job: string }>(credits: T[]): T[] {
  const ignoredRoles = ['Thanks', 'Characters']
  return credits.filter(movie => !!movie.vote_count && !ignoredRoles.includes(movie.job))
}

function aggregateAndNormalizeJobs<T extends { id: number }, R extends T & { job: string }>(credits: (T & { job: string })[]): (T & { jobs: string[] })[] {
  const creditsById = {}
  for (let credit of credits) {
    const normalizedRole = credit.job
      .replace('Executive ', '')
      .replace('Associate ', '')
      .replace('Special Guest ', '')
      .replace('Co-Producer', 'Producer')
      .replace('Assistant Director', 'Music')
      .replace('Music Producer', 'Music')
      .replace('Orchestrator', 'Music')
      .replace('Conductor', 'Music')
      .replace('Original Music Composer', 'Music')
      .replace('Sound Designer', 'Sound')
      .replace('Screenplay', 'Writer')
      .replace('Scenario Writer', 'Writer')
      .replace('Theatre Play', 'Writer')
      .replace('Story', 'Writer')
      .replace('Author', 'Writer')
      .replace('Technical Advisor', 'Advisor')
      .replace('Script Consultant', 'Advisor')
      .replace('Camera Operator', 'Cameras')
      .replace('Director of Photography', 'Cinematography')

    if (creditsById[credit.id]) {
      creditsById[credit.id].jobs.push(normalizedRole)
    } else {
      creditsById[credit.id] = {...credit, jobs: [normalizedRole]}
    }
  }
  return Object.values(creditsById)
}

function filterInsignificantPeople<T extends { job: string }>(crew: T[]): T[] {
  const ignoredRoles = ['Thanks', 'Characters']
  return crew.filter(personCredit => !ignoredRoles.includes(personCredit.job))
}

function sortByRole(creditA: PersonCreditForMovie, creditB: PersonCreditForMovie): number {
  const jobsByImportance = [
    "Casting",
    "Editor",
    "Music",
    "Sound",
    "Producer",
    "Cinematography",
    "Writer",
    "Director",
  ]
  const creditAPrecedence = Math.max(...creditA.jobs.map(job => jobsByImportance.findIndex(importantJob => job === importantJob)))
  const creditBPrecedence = Math.max(...creditB.jobs.map(job => jobsByImportance.findIndex(importantJob => job === importantJob)))
  return creditAPrecedence > creditBPrecedence ? -1 : 1
}

function pickPersonCreditForMovieProperties(movie: PersonCreditForMovie): PersonCreditForMovie {
  return pick(movie, ['id', 'name', 'profile_path', 'jobs'])
}

function pickMovieProperties(movie: MovieResponse): Movie {
  return pick(movie, ['id', 'title', 'poster_path', 'release_date', 'vote_average', 'overview', 'tagline']) as Movie
}

function pickPersonProperties(person: MovieDbPerson): Person {
  return pick(person, ['id', 'name', 'biography', 'known_for_department', 'profile_path']) as Person
}
