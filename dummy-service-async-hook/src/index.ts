import { bootstrap } from "./bootstrap";
import { executionCtxLocalStorage } from "./common/execution-context/exucutionCtxLocalStorage";
import { HttpApp } from "./http/app";
import { safeObjectStringify } from "./common/util";
import { createLogger } from "./common/logger";
import apm from 'elastic-apm-node';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const log = createLogger(__filename);

(async () => {
    global.executionContextLocalStorage = executionCtxLocalStorage;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    process.on('SIGTERM', () => {
        // node:process signal process handling
        log.error('SIGTERM signal received, closing all servers and connections');
        log.debug(`SIGTERM signal received from node process id: ${process.pid}`);
        try {
            // TODO handle gracefully exit
            // TODO after mongo connection using secure store is stable, otherwise 'CrashLoopBackOff'
            // 1. Disconnect MongoDb connection
            // ServerGRPC.stop().then().catch(); Gracefully stop Grpc serve
            log.debug('closing http server');
            HttpApp.getHttpApp()
                .close()
                .then(() => log.info('http server closed'))
                .catch((e: Error) => {
                    log.error('http server failed to close with');
                    log.debug(safeObjectStringify(e));
                });
            apm.destroy();
        } catch (e) {
            log.error('Error during closing connections');
            log.debug(safeObjectStringify(e));
        } finally {
            executionContextLocalStorage.destroy();
            log.info('removed/exited all linked execution contexts from async local storage');
            log.info('~~~ EXITED ~~~');
            process.exit(1);
        }
    });
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    log.info('Initializing application');
    log.info('Initialization completed');
    try {
        await bootstrap();
        log.info('Bootstrapped all servers and connections');

        // ~~~ welcome ascii art ~~~
        const art = readFileSync(resolve(__dirname + '/resources/server-art.txt')).toString();
        console.log(art); // eslint-disable-line no-console
        // ~~~ * ~~~
    } catch (err) {
        log.error('An unfortunate event occurred, application is now shutting down with error');
        log.debug(safeObjectStringify(err));
        process.kill(process.pid, 'SIGTERM');
    }
})();

