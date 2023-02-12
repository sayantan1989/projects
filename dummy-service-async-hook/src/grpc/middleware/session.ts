import { ICorrelation } from '../../schema/ICorrelation';
import { createSession, createExecutionCtxWithSession } from '../../common/session';
import { ISession } from '../../../src/schema/ISession';
import { IIamToken } from '../../../src/common/iam-token/IIamToken';
import { Context } from 'mali';
import { cloneDeep } from 'lodash';
import { createLogger, LogLevel } from '../../common/logger';

const log = createLogger(__filename);

export function sessionMw() {
    return async function (ctx: Context<unknown>, next: (...args: any[]) => any) {
        try {
            const payload = cloneDeep(ctx.req);
            const metadata = cloneDeep(ctx.request.metadata);
            const clientIp = (ctx.call.getPeer() ?? '').split(':').shift().trim();

            let session: ISession;
            // case 1 : direct gRPC call;
            // token should be available we get context information from token
            if (metadata && metadata['token']) {
                const jwtToken = metadata['token'];
                session = createSession(jwtToken, undefined, undefined, clientIp);
            }

            // case 2 : call vai Event Service
            // we get context information from event payload
            else if (payload.source) {
                const corrObj: ICorrelation = {
                    requestId: payload.xRequestId,
                    b3TraceId: payload.xB3TraceId,
                    b3SpanId: payload.xB3SpanId,
                    b3ParentSpanId: payload.xB3ParentSpanId,
                    b3Sampled: payload.xB3Sampled
                };
                const decodedIamToken: Partial<IIamToken> = {
                    //TODO: pass the zid(tenant) and other defaults
                    zid: payload.source
                };
                session = createSession(undefined, decodedIamToken, corrObj, clientIp);
            }

            // case 3 : direct gRPC calls
            // we get context from payload systemAdminData
            else if (payload.systemAdminData?.tenantId) {
                const decodedIamToken: Partial<IIamToken> = {
                    //TODO: pass the zid(tenant) and other defaults
                    uid: payload.systemAdminData.userId,
                    zid: payload.systemAdminData.tenantId,
                    language: payload.systemAdminData.language,
                    locale: payload.systemAdminData.locale,
                };
                session = createSession(undefined, decodedIamToken, undefined, clientIp);
            }

            // case 4 : no context info available
            else {
            }

            await createExecutionCtxWithSessionAsyncWrap(session, next);
        } catch (err) {
            log.debug(err.message);
            throw err;
        }

        async function createExecutionCtxWithSessionAsyncWrap(data: any, nextMw: any) {
            return new Promise((resolve, reject) => {
                createExecutionCtxWithSession(data, () => {
                    return (async (func) => {
                        await func();
                    })(nextMw)
                        .then(d => resolve(d))
                        .catch(e => reject(e));
                });
            });
        }

    };
}