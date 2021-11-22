import * as express from 'express';
import {Application} from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as morgan from 'morgan';
import auth from './routes/auth';
import tmdb from './routes/tmdb';
import {getConnectedMovies, getRecommendedMovies} from './get_suggestions'

import { MovieDb } from 'moviedb-promise';
import {UserData} from "./UserData";
const moviedb = new MovieDb('39ddef1da9fcaa6207e6421b04dbd9ec');

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.setupApi();
  }

  public startServer(port: number) {
    this.app.set('port', port);
    http.createServer(this.app)
      .listen(port, () => console.log(`Running on localhost:${port}`));
  }

  private configure() {
    this.app.use(express.static(path.join(__dirname, 'dist')));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(morgan('dev'));
  }

  private setupApi() {
    this.app.get('/api', (req, res) => res.status(200).send('API running'));
    this.app.use('/api', auth, tmdb);
    this.app.get('/test-api/search/:query', async (req, res) => {
      const response = await moviedb.searchMovie({ query: req.params.query });
      res.status(200).send(response.results);
    });

    this.app.post('/test-api/suggestions', async (req, res) => {
      const movies = await getRecommendedMovies(req.body.selected, req.body.ignored);
      res.status(200).send(movies);
    });

    this.app.get('/test-api/likesAndDislikes', async (req, res) => {
      const likes = UserData.getLiked(parseInt(req.query.userId));
      const dislikes = UserData.getDisliked(parseInt(req.query.userId));
      return res.status(200).send({ likes, dislikes });
    });

    this.app.post('/test-api/likes/:movieId', async (req, res) => {
      console.log('liking!!!')
      try {
        UserData.addLike(parseInt(req.query.userId), parseInt(req.params.movieId));
        console.log('liking!!!')
        return res.status(204);
      } catch (e) {
        console.error('error!')
      }
    });

    this.app.post('/test-api/dislikes/:movieId', async (req, res) => {
      UserData.addDislike(parseInt(req.query.userId), parseInt(req.params.movieId));
      return res.status(204);
    });

    this.app.delete('/test-api/likes/:movieId', async (req, res) => {
      UserData.removeLike(parseInt(req.query.userId), parseInt(req.params.movieId));
      return res.status(204);
    });

    this.app.delete('/test-api/dislikes/:movieId', async (req, res) => {
      UserData.addDislike(parseInt(req.query.userId), parseInt(req.params.movieId));
      return res.status(204);
    });

    this.app.use(express.static(__dirname + '../testing/dist'));
    this.app.get('/test', (req, res) => res.sendFile(path.join(__dirname, '../src/testing/src/index.html')))
    this.app.get('/main.js', (req, res) => res.sendFile(path.join(__dirname, '../src/testing/dist/main.js')))
    // this.app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
  }
}
