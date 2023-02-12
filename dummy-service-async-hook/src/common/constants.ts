
const VERB = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
});

interface IResponseStatusCode {
    code: number,
    description: string
}
const STATUS_CODE = Object.freeze({
    200: { code: 200, description: 'OK' } as IResponseStatusCode,
    201: { code: 201, description: 'Created' } as IResponseStatusCode,
    202: { code: 202, description: 'Accepted' } as IResponseStatusCode,
    204: { code: 204, description: 'No content' } as IResponseStatusCode,
    400: { code: 400, description: 'Bad Request' } as IResponseStatusCode,
    401: { code: 401, description: 'Unauthorized' } as IResponseStatusCode,
    403: { code: 403, description: 'Forbidden' } as IResponseStatusCode,
    404: { code: 404, description: 'Not Found' } as IResponseStatusCode,
    405: { code: 405, description: 'Method Not Allowed' } as IResponseStatusCode,
    406: { code: 406, description: 'Not Acceptable' } as IResponseStatusCode,
    413: { code: 413, description: 'Payload Too Large' } as IResponseStatusCode,
    500: { code: 500, description: 'Internal Server Error' } as IResponseStatusCode,
    501: { code: 501, description: 'Not Implemented' } as IResponseStatusCode
});
export const HTTP = Object.freeze({
    VERB: VERB,
    STATUS_CODE: STATUS_CODE
});



export const IAM_TOKEN_DEFAULT = Object.freeze({
    uid: '00000000-0000-0000-0000-000000000000',
    language: 'en',
    locale: 'en-US',
    admin: true,
    log: 1,
    zid: '000000000000000000000000'
});


export const X_REQUEST_ID = 'x-request-id';
export const GLOBAL_API_PREFIX = '/user-service';
