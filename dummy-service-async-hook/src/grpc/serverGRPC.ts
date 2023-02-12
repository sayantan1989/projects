import Mali from 'mali';
import path from 'path';
import { Env } from '../env';
import { ServerCredentials } from '@grpc/grpc-js';
import { UserGrpc } from './handler/userHandler';
import { IServiceScope } from '../schema/IServiceScope';
import { sessionMw } from './middleware/session';
import { getSessionFromExecutionCtx } from '../common/session';
import { createLogger } from '../common/logger';

const log = createLogger(__filename);



export class ServerGrpc {
  /**
  * Starts a gRPC server that receives requests for the Greeter service at  the
  * sample server port
  * @param  {IServiceScope} serviceScope
  */
  static async start(serviceScope: IServiceScope) {
    log.info('starting gRPC app(s)');

    const UserGrpc = getUserGrpcInstance(serviceScope);
    const UserServiceApp = this.getUserServiceApp();
    /* will be called when any error is raised from gRPC, ex : zid, invalid payload etc */


    const ipAddress = Env.getGrpcIp();
    const grpcPort = Env.getUserGrpcPort();

    try {
      //start gRPC apps
      UserServiceApp.start(`${ipAddress}:${grpcPort}`), ServerCredentials.createInsecure();
    } catch (e) {
      log.error(`error in starting gRPC Servers`);
    }

  }
  static getUserServiceApp() {
    const pathUser = path.resolve(__dirname, '../../protos/User.proto');
    return new Mali(pathUser);

  }



}

function getUserGrpcInstance(serviceScope: IServiceScope) {
  return new UserGrpc(getSessionFromExecutionCtx);
}




