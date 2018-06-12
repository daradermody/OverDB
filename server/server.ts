import * as express from 'express';
import {Application} from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as morgan from 'morgan';
import auth from './routes/auth';
import tmdb from './routes/tmdb';


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

    this.app.use(express.static(__dirname + '/..'));
    this.app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
  }
}
