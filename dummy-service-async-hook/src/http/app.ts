import express from 'express';
import compression from 'compression';
import { Env } from '../env';
import { User } from './routes/userRoute';
import { createServer, Server } from 'http';
import helmet from 'helmet';
import { IServiceScope } from '../schema/IServiceScope';
import { sessionMw } from './middleware/session';
import { clientErrorHandlingMw, notImplementedErrorMw } from './middleware/errorHandler';

export class HttpApp {
  private static _app: HttpApp;
  private static _express: express.Express;
  private static _httpServer: Server;

  /**
   * Constructor
   * @param  {IServiceScope} serviceScope - service scope object
   */
  private constructor(serviceScope: IServiceScope) {
    HttpApp._express = express();
    HttpApp._httpServer = createServer(HttpApp._express);
    this._registerMiddleWares();
    this._registerRoutes(serviceScope);
    this._registerErrorHandlers();
  }

  /**
   * Returns the HTTP Application
   * @param  {IServiceScope} [serviceScope] - service scope object
   * @returns HttpApp - the http application
   */
  static getHttpApp(serviceScope?: IServiceScope): HttpApp {
    if (!HttpApp._app) {
      if (serviceScope) {
        HttpApp._app = new HttpApp(serviceScope);
      } else {
        throw new Error('required parameter servicescope is not passed');
      }
    }
    return HttpApp._app;
  }

  /**
   * Returns the http server
   * @returns Server - http server
   */
  static getServer(): Server {
    return HttpApp._httpServer;
  }

  /**
   * lister/start the server for given the port
   * @param  {number} port - port number
   * @returns Promise<Server> - http server
   */
  public listen(port: number): Promise<Server> {
    const httpServer = HttpApp.getServer();
    return new Promise((resolve) => {
      httpServer.listen(port, () => resolve(httpServer));
    });
  }

  /**
   * Close the http server
   * @returns Promise
   */
  public close(): Promise<void> {
    const httpServer = HttpApp.getServer();
    return new Promise<void>((resolve, reject) => {
      httpServer.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Register middleware(s)
   */
  private _registerMiddleWares() {
    HttpApp._express.use(express.json());
    HttpApp._express.use(express.urlencoded({ extended: false }));
    HttpApp._express.use(helmet({
      frameguard: { action: 'DENY' }
    }));
    //? Do we need gzip compression or leverage reverse-proxy's compression?
    // Refer: https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression
    HttpApp._express.use(compression());
    HttpApp._express.use(sessionMw());
  }

  /**
   * Register routes
   * @param  {IServiceScope} serviceScope - service scope object
   */
  private _registerRoutes(serviceScope: IServiceScope) {
    console.log(`Registering route : ${Env.getApiUrl()}/case1`);
    console.log(`Registering route : ${Env.getApiUrl()}/case2`);
    console.log(`Registering route : ${Env.getApiUrl()}/case3`);

    HttpApp._express.use(`${Env.getApiUrl()}/case1`, new User().getUserRouter());
    HttpApp._express.use(`${Env.getApiUrl()}/case2`, new User().getUserRouter());
    HttpApp._express.use(`${Env.getApiUrl()}/case3`, new User().getUserRouter());
  }

  /**
   * Register Error handlers
   */
  private _registerErrorHandlers() {
    HttpApp._express.use(`${Env.getApiUrl()}`, notImplementedErrorMw());
    HttpApp._express.use(`${Env.getApiUrl()}`, clientErrorHandlingMw());
  }

}
