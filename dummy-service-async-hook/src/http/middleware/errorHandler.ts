import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HTTP } from '../../common/constants';
import { applicationError, notImplementedError } from '../error';
import { safeObjectStringify } from '../../common/util';
import { createLogger } from '../../common/logger';

const log = createLogger(__filename);

export function notImplementedErrorMw() {
    return function (req: Request, res: Response, next: NextFunction) {
        log.error('Method not implemented');
        res.status(HTTP.STATUS_CODE[501].code).json(notImplementedError());
    };
}

export function clientErrorHandlingMw(): ErrorRequestHandler {
    return function (err, req: Request, res: Response, next: NextFunction) {
        log.error(err.message);
        log.debug(safeObjectStringify(err));
        const errStatus = err.statusCode ?? HTTP.STATUS_CODE[500].code;
        res.status(errStatus).json(applicationError(err));
    };
}