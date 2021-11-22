import * as fs from 'fs';
import { MovieDb } from 'moviedb-promise';

const CREW_PRIORITY = {
  'Director': 10,
  'Writer': 8,
  'Director of Photography': 7,
  'Screenplay': 6,
  'Producer': 5,
  'Original Music Composer': 4,
  'Executive Producer': 3,
  'Editor': 2,
};

const CREW_JOBS = Object.keys(CREW_PRIORITY);

// @ts-ignore
class MovieDbParallel extends MovieDb {
  dequeue() {
    // @ts-ignore
    const request = this.requests.shift();
    if (!request) {
      return;
    }
    request.promiseGenerator()
      .then(request.resolve)
      .catch(request.reject)
      .finally(() => this.dequeue());
  }
}
const moviedb = new MovieDbParallel('39ddef1da9fcaa6207e6421b04dbd9ec');

export async function getRecommendedMovies(likedMovieIds: number[], dislikedMovieIds: number[]) {
  console.time()
  const recommendedMovieLists: number[][] = [];
  await Promise.all(likedMovieIds.map(async id => {
    recommendedMovieLists.push(await MovieDbCache.recommended(id));
  }));

  const recommendedMovieIds: Set<number> = new Set();
  for (let i = 0; i < recommendedMovieLists[0].length; ++i) {
    for (let j = 0; j < recommendedMovieLists.length; ++j) {
      recommendedMovieIds.add(recommendedMovieLists[j][i]);
    }
  }

  const movieIds = Array.from(recommendedMovieIds)
    .filter(id => !likedMovieIds.includes(id) && !dislikedMovieIds.includes(id))
    .slice(0, 18);

  const suggestions = Promise.all(movieIds.map(id => MovieDbCache.movieInfo(id)));
  console.timeEnd();
  return suggestions;
}

export async function getConnectedMovies(likedMovieIds: number[], dislikedMovieIds: number[]) {
  console.time()
  const moviePriorities: Record<string, number> = {};
  await Promise.all(likedMovieIds.map(async movieId => {
    const credits = await MovieDbCache.movieCredits(movieId);
    const peopleWithPriorities = await getRecommendedPeople(credits);

    const movies = await getMoviesForPeople(peopleWithPriorities);
    for (const movie of movies) {
      moviePriorities[movie.id] = (moviePriorities[movie.id] || 0 ) + movie.priority;
    }
  }))

  const movieIds = Object.entries(moviePriorities)
    .map(([id, priority]) => ({ id: parseInt(id), priority }))
    .filter(m => !likedMovieIds.includes(m.id) && !dislikedMovieIds.includes(m.id))
    .sort(by('priority'))
    .slice(0, 18)
    .map(({ id }) => id);

  const suggestions = Promise.all(movieIds.map(id => MovieDbCache.movieInfo(id)));
  console.timeEnd();
  return suggestions;
}

async function getRecommendedPeople(credits: MovieCredit[]): Promise<Person[]> {
  const filteredCredits = credits.filter(c => !isCrewCredit(c) || CREW_JOBS.includes(c.job))

  const peoplePriority: Record<string, number> = {};
  for (const credit of filteredCredits) {
    if (!peoplePriority[credit.personId]) {
      peoplePriority[credit.personId] = 0;
    }
    if (isCrewCredit(credit)) {
      peoplePriority[credit.personId] += CREW_PRIORITY[credit.job];
    } else {
      peoplePriority[credit.personId] += 5 - credit.order;
    }
  }

  return Object.entries(peoplePriority)
    .map(([id, priority]) => ({ id: parseInt(id), priority }))
    .sort(by('priority'))
    .slice(0, 35);
}

function isCrewCredit(person: MovieCredit): person is CrewJob {
  return !!(person as CrewJob).job;
}

async function getMoviesForPeople(people: Person[]): Promise<PrioritisedMovie[]> {
  const moviePriorities: Record<number, number> = [];
  console.log(`Fetching information for ${people.length} people`);
  const credits = await MovieDbCache.peopleCredits(people.map(p => p.id));
  console.log('Fetched!')

  const peopleWithCredits = people.map((person, i) => ({ ...person, movieCredits: credits[i] }));
  for (const person of peopleWithCredits) {
    const filteredCredits = person.movieCredits
      .filter(credit => isCrewCredit(credit) ? (CREW_JOBS.includes(credit.job) && credit.moviePopularity > 5) : credit.order <= 5);

    for (const credit of filteredCredits) {
      if (!moviePriorities[credit.movieId]) {
        moviePriorities[credit.movieId] = 0;
      }
      if (isCrewCredit(credit)) {
        moviePriorities[credit.movieId] += CREW_PRIORITY[credit.job] * person.priority;
      } else {
        moviePriorities[credit.movieId] += (5 - credit.order) * person.priority;
      }
    }
  }
  console.log('People prioritised!')
  return Object.entries(moviePriorities)
    .map(([id, priority]) => ({ id: parseInt(id), priority }));
}

function by<T, K extends keyof T>(field: K) {
  return (a: T, b: T): number => (b[field] as any as number) - (a[field] as any as number);
}




interface Person {
  id: number;
  priority: number;
}

export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
}

interface PrioritisedMovie {
  id: number;
  priority: number;
}

interface BaseJob {
  personId: number;
  movieId: number;
  moviePopularity: number;
}

interface CrewJob extends BaseJob {
  job: string;
}

interface CastRole extends BaseJob {
  order: number;
}

type MovieCredit = CrewJob | CastRole;



interface Cache {
  movieInfo: {
    [movieId: string]: {
      title?: string;
      poster_path?: string
    };
  }
  movieCredits: {
    [movieId: string]: MovieCredit[];
  }
  personCredits: {
    [personId: string]: MovieCredit[];
  }
  recommended: {
    [movieId: string]: number[];
  }
}

class MovieDbCache {
  static FILE_PATH = `${__dirname}/moviedb_cache.json`
  private static cache: Cache = MovieDbCache.readCache();

  private static readCache(): Cache {
    if (!fs.existsSync(MovieDbCache.FILE_PATH)) {
      const initial = { movieCredits: {}, personCredits: {}, movieInfo: {}, recommended: [] };
      fs.writeFileSync(MovieDbCache.FILE_PATH, JSON.stringify(initial));
    }
    return JSON.parse(fs.readFileSync(MovieDbCache.FILE_PATH, 'utf-8'));
  }

  static async movieInfo(id: number): Promise<Movie> {
    if (!MovieDbCache.cache.movieInfo[id]) {
      process.stdout.write('.');
      MovieDbCache.cache.movieInfo[id] = pick(await moviedb.movieInfo({ id }), ['poster_path', 'title']);
      MovieDbCache.save();
    }
    return { id, title: '', ...MovieDbCache.cache.movieInfo[id] };
  }

  static async movieCredits(movieId: number): Promise<MovieCredit[]> {
    if (!MovieDbCache.cache.movieCredits[movieId]) {
      const { cast, crew } = await moviedb.movieCredits({ id: movieId });
      const crewJobs: CrewJob[] = crew.map(movieCredit => ({
        movieId: movieId,
        job: movieCredit.job,
        moviePopularity: movieCredit.popularity,
        personId: movieCredit.id,
      }));
      const castRoles: CastRole[] = cast.map(movieCredit => ({
        movieId: movieId,
        order: movieCredit.order,
        moviePopularity: movieCredit.popularity,
        personId: movieCredit.id
      }));
      MovieDbCache.cache.movieCredits[movieId] = [...crewJobs, ...castRoles];
      MovieDbCache.save();
    }
    return MovieDbCache.cache.movieCredits[movieId];
  }

  static async peopleCredits(peopleIds: number[]): Promise<MovieCredit[][]> {
    const idsNotCached = peopleIds.filter(id => !MovieDbCache.cache.personCredits[id]);
    await Promise.all(idsNotCached.map(async id => {
      console.time(`${id}`);
      console.log('fetching', id)
      const { cast, crew } = await moviedb.personMovieCredits({ id });
      const crewJobs: CrewJob[] = crew.map(c => ({
        job: c.job,
        movieId: c.id,
        personId: id,
        moviePopularity: c.popularity,
      }));
      const castRoles: CastRole[] = cast.map(c => ({
        order: c['order'],
        movieId: c.id,
        personId: id,
        moviePopularity: c.popularity,
      }));
      MovieDbCache.cache.personCredits[id] = [...crewJobs, ...castRoles];
      console.timeEnd(`${id}`);
    }));
    if (idsNotCached.length) {
      MovieDbCache.save();
    }
    return peopleIds.map(id => MovieDbCache.cache.personCredits[id]);
  }

  static async personCredits(personId: number): Promise<MovieCredit[]> {
    if (!MovieDbCache.cache.personCredits[personId]) {
      console.log(`Querying for ${personId}`)
      const { cast, crew } = await moviedb.personMovieCredits({ id: personId });
      console.log('order', cast[0]['order']);
      const crewJobs: CrewJob[] = crew.map(c => ({
        job: c.job,
        movieId: c.id,
        personId,
        moviePopularity: c.popularity,
      }));
      const castRoles: CastRole[] = cast.map(c => ({
        order: c['order'],
        movieId: c.id,
        personId: personId,
        moviePopularity: c.popularity,
      }));
      MovieDbCache.cache.personCredits[personId] = [...crewJobs, ...castRoles];
      console.log('saving');
      MovieDbCache.save();
      console.log('saved');
    }
    return MovieDbCache.cache.personCredits[personId];
  }

  static async recommended(movieId: number): Promise<number[]> {
    if (!MovieDbCache.cache.recommended[movieId]) {
      console.log(`Querying for ${movieId}`)
      const recommendations = await moviedb.movieRecommendations(movieId);
      MovieDbCache.cache.recommended[movieId] = recommendations.results.map(movie => movie.id);
      MovieDbCache.save();
    }
    return MovieDbCache.cache.recommended[movieId];
  }

  static save() {
    fs.writeFileSync(MovieDbCache.FILE_PATH, JSON.stringify(MovieDbCache.cache));
  }
}

function pick<T, K extends keyof T>(data: T, keys: K[]): Pick<T, K> {
  const newData: Partial<T> = {};
  for (const key of keys) {
    newData[key] = data[key];
  }
  return newData as Pick<T, K>;
}

getRecommendedMovies([3, 7974], []).then(console.log);
