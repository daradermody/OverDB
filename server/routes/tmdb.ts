import {Request, Response, Router} from 'express';
import * as fs from 'fs';

class Auth {
  public router = Router();
  private static readonly apiKey = fs.readFileSync('server/tmdbApiKey.txt', 'utf-8').trimRight();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('/getTmdbApiKey', Auth.getApiKey);
  }

  static getApiKey(req: Request, res: Response) {
    res.status(200).send(Auth.apiKey);
  }
}

export default new Auth().router;
