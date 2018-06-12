import {Request, Response, Router} from 'express';
import {Storage} from '../database';

class Auth {
  public router = Router();

  constructor() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('/person', Auth.getPerson);
    this.router.post('/person/add', Auth.addPerson);
    this.router.post('/person/remove', Auth.removePerson);
  }

  static getPerson(req: Request, res: Response) {
    try {
      res.status(200).json(Storage.getFollowedPeople('Dara'));
    } catch (e) {
      console.error(e);
      res.status(500).json({userMessage: 'Error getting followed people: ' + e});
    }
  }

  static addPerson(req: Request, res: Response) {
    try {
      Storage.addFollowedPerson('Dara', req.body);
      res.sendStatus(204);
    } catch (e) {
      console.error(e);
      res.status(500).json({userMessage: 'Error adding followed person: ' + e});
    }
  }

  static removePerson(req: Request, res: Response) {
    try {
      Storage.removeFollowedPerson('Dara', req.body.name);
      res.sendStatus(204);
    } catch (e) {
      console.error(e);
      res.status(500).json({userMessage: 'Error removing followed person: ' + e});
    }
  }
}

export default new Auth().router;
