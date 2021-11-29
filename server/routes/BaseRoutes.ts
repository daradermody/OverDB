import {Router} from "express";
import {NextFunction, PathParams, Request, RequestHandler, Response} from "express-serve-static-core";

export default abstract class BaseRoutes {
  public router = Router();

  constructor() {
    this.setupRoutes();
  }

  abstract setupRoutes(): void;

  reply<T>(handler: SimpleRequestHandler<T>): RequestHandler {
    return async function(req, res, next): Promise<void> {
      res.status(200)
      res.send(await handler(req, res, next))
    }
  }

  get<T>(path: PathParams, handler: SimpleRequestHandler<T>): void {
    this.router.get(path, this.reply(handler))
  }

  post<T>(path: PathParams, handler: SimpleRequestHandler<T>): void {
    this.router.post(path, this.reply(handler))
  }

  put<T>(path: PathParams, handler: SimpleRequestHandler<T>): void {
    this.router.put(path, this.reply(handler))
  }

  delete<T>(path: PathParams, handler: SimpleRequestHandler<T>): void {
    this.router.delete(path, this.reply(handler))
  }
}

type SimpleRequestHandler<T> = (req: Request, res: Response, next: NextFunction) => T | Promise<T>
