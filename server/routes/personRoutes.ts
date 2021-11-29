import {UserData} from "../UserData";
import MovieDb from "../MovieDb";
import BaseRoutes from "./BaseRoutes";
import {PersonResult} from "moviedb-promise/dist/request-types";
import {FavouritablePerson, MovieCreditForPerson} from "../types";

class PersonRoutes extends BaseRoutes {
  setupRoutes() {
    this.get<FavouritablePerson[]>('/favourites', () => {
      const ids = UserData.getFavourites(0)
      return Promise.all(ids.map(PersonRoutes.getPerson))
    })

    this.get<PersonResult[]>('/search/:query', req => {
      return MovieDb.searchPerson({query: req.params.query})
        .then(response => response.results);
    });

    this.get<FavouritablePerson>('/:id', req => {
      return PersonRoutes.getPerson(parseInt(req.params.id))
    })

    this.get<MovieCreditForPerson[]>('/:id/movies', async req => {
      const movieCredits = await MovieDb.personMovieCredits(req.params.id)
      return Promise.all(movieCredits.map(async movie => ({
        ...await MovieDb.movieInfo(movie.id),
        jobs: movie.jobs,
        sentiment: UserData.getSentiment(0, movie.id),
        watched: UserData.isWatched(0, movie.id),
        inWatchlist: UserData.inWatchlist(0, movie.id),
      })))
    });

    this.post<void>('/:id/favourite', req => {
      UserData.addFavourite(0, parseInt(req.params.id))
    });

    this.post('/:id/unfavourite', req => {
      UserData.removeFavourite(0, parseInt(req.params.id))
    });
  }

  private static async getPerson(id: number): Promise<FavouritablePerson> {
    return {
      ...await MovieDb.personInfo(id),
      favourited: UserData.isFavourited(0, id)
    };
  }
}

export default new PersonRoutes().router;
