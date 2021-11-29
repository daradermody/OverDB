import * as express from 'express';
import {Application} from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as morgan from 'morgan';
import movie from "./routes/movieRoutes";
import person from "./routes/personRoutes";
import recommendation from "./routes/recommendationRoutes";

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
    this.app.use(setCache)
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(morgan('dev'));
  }

  private setupApi() {
    this.app.use('/api/person', person);
    this.app.use('/api/movie', movie);
    this.app.use('/api/recommendation', recommendation);
    // this.app.use(express.static(__dirname + '../dist'));
    // this.app.get('/test', (req, res) => res.sendFile(path.join(__dirname, '../src/testing/src/index.html')))
    // this.app.get('/main.js', (req, res) => res.sendFile(path.join(__dirname, '../src/testing/dist/main.js')))
  }
}

function setCache(req, res, next) {
  const period = 60 * 5
  res.set('Cache-control', req.method == 'GET' ? `public, max-age=${period}` : 'no-store')
  next()
}
