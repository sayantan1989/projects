import { ServerGrpc } from './grpc/serverGRPC';
import { HttpApp } from './http/app';
import { Env } from './env';
import { IServiceScope } from './schema/IServiceScope';
import { createLogger } from "./common/logger";

const log = createLogger(__filename);

/**
 * @function
 * @async
 * Bootstrap all connections and servers for the application
 */
export async function bootstrap() {
    // connect to database (MongoDb)
    log.info('connected to database: MongoDb');

    // create service scope
    // add global contexts in this structure if needed
    const serviceScope: IServiceScope = {
        mongoClient: null
    };

    // initialize gPRC server
    await ServerGrpc.start(serviceScope);
    log.info('initialized gRPC server');

    // initialize http server using
    await HttpApp.getHttpApp(serviceScope)
        .listen(Env.getUserHttpPort());
    log.info(`initialized http server at port: ${Env.getUserHttpPort()}`);
}