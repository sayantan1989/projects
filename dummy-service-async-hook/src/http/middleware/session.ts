import { Request, Response, NextFunction } from 'express';
import { createSession, createExecutionCtxWithSession } from '../../common/session';

export function sessionMw() {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            const reqHeader = req.headers;
            createExecutionCtxWithSession(reqHeader, async () => next());
        } catch (err) {
            next(err);
        }
    };
}
