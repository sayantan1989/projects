interface IHttpClientErrorRes {
    code: string,
    message: string
}

interface IHttpErrorPayload {
    error: IHttpClientErrorRes
}

/**
 *
 * @returns
 */
export const notImplementedError = function (): IHttpErrorPayload {
    return {
        error: {
            code: '00000',
            message: 'Method is not implemented'
        }
    };
};

/**
 *
 * @param err
 * @returns
 */
export const applicationError = function (err: Error): IHttpErrorPayload {
    let errorResponse: IHttpErrorPayload = {
        error: {
            code: '00000',
            message: 'Unhandled Error Occurred'
        }
    };

    return errorResponse;
};