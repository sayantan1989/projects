import { isObject } from 'lodash';
import { ICorrelation, ISession } from "../schema";
import { IamTokenUtil } from "./iam-token/iamTokenUtil";
import { IIamToken } from "./iam-token/IIamToken";

/**
 * @function
 * Create Session object from jwt token string and/or decoded token and/or correlation ids
 * @param  {string} [jwtToken] - jwt token string
 * @param  {Partial<IIamToken>} [decodedIamToken] - decoded iam token
 * @param  {ICorrelation} [correlation] - correlation ids
 * @returns ISession - session object
 */
export function createSession(jwtToken?: string, decodedIamToken?: Partial<IIamToken>, correlation?: ICorrelation, clientIp?: string): ISession {
    const session: ISession = {
        decodedIamToken: {}
    };

    fillCorrelationIds(session, correlation);
    fillDecodedJwtToken(session, jwtToken, decodedIamToken);

    session.clientIp = clientIp ?? '';

    return session;
}

/**
 * @function
 * Create an execution context with an a session
 * @param  {ISession} session - session object
 * @param  {(...args:any[])=>any} callbackFn - callback
 * @returns void
 */
export function createExecutionCtxWithSession(session: any, callbackFn: (...args: any[]) => any): void {
    const immutableSessionObj: { session: any } = { session: deepFreeze(session) };
    Object.defineProperty(immutableSessionObj, "session", { configurable: false, writable: false });
    global.executionContextLocalStorage.setExecutionCtx(immutableSessionObj, callbackFn);
}



/**
 * @function
 * Get session from the running context
 * @returns ISession - session
 */
export function getSessionFromExecutionCtx(): any | undefined {
    return global.executionContextLocalStorage?.getExecutionCtx()?.session;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/**
 * @function
 * fill correlation ids for session object
 * @param  {ISession} session - session
 * @param  {ICorrelation} correlation - correlation
 */
function fillCorrelationIds(session: ISession, correlation: ICorrelation) {
    for (const property in correlation) {
        if ((correlation as any)[property]) {
            (session as any)[property] = (correlation as any)[property];
        }
    }
}

/**
 * @function
 * fill decoded Jwt token
 * @param  {ISession} session - session
 * @param  {string} [jwtToken] - jwt token string
 * @param  {Partial<IIamToken>} [decodedIamToken] - decoded iam token
 */
function fillDecodedJwtToken(session: ISession, jwtToken?: string, decodedIamToken?: Partial<IIamToken>) {
    if (jwtToken) {
        const bearer = jwtToken.split('Bearer ');
        const tokenWithoutBearer = bearer[1] || bearer[0];
        const iamToken = new IamTokenUtil().decodeToken(tokenWithoutBearer);
        if (iamToken) {
            session.decodedIamToken = iamToken;
            session.jwtToken = jwtToken;
            session.jwtToken = tokenWithoutBearer;
        }
    }
    if (decodedIamToken) {
        session.decodedIamToken = decodedIamToken;
    }
}

/**
 * @function
 * deep freeze an object
 * @param  {any} obj
 */
function deepFreeze(obj: any) {
    if (isObject(obj)) {
        Object.freeze(obj);
    } else {
        return obj;
    }
    Object.getOwnPropertyNames(obj).forEach((p) => {
        const prop = p as keyof typeof obj;
        if (obj[prop] !== null
            && obj[prop] !== undefined
            && isObject(obj)
            && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
        }
    });
    return obj;
}


