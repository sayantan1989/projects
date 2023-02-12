import { createLogger } from '../../common/logger';

const log = createLogger(__filename);

export class UserGrpc {
    private _getSessionFromExecutionCtx: any;
    private _buildPayload: any;

    constructor(getSessionFromExecutionCtx: any) {
        this._getSessionFromExecutionCtx = getSessionFromExecutionCtx;
    }

    public getDependency() {
        // inside the below async function we don't have context of this, hence we are initializing variables here
        const getSessionFromExecutionCtx = this._getSessionFromExecutionCtx;
        const buildPayload = this._buildPayload;

        return async function (ctx: any, next: any) {
            try {
                const session = getSessionFromExecutionCtx();
                const requestPayload = buildPayload(ctx, session);
                log.debug('get dependency GRPC :', JSON.stringify(requestPayload));
                const result = 'test 123';
                ctx.response.res = {
                    success: true,
                    message: `Get dependency, ${(result as any).length} records found`,
                    dependencies: JSON.stringify(result)
                };
                await next();
            }
            catch (e) {
                await next(e);
            }
        };
    }
}

