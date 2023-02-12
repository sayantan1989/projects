import { decode } from 'jsonwebtoken';
import { IIamToken } from './IIamToken';
import { createLogger, ILog } from '../logger';

export class IamTokenUtil {
    private _log: ILog;

    constructor() {
        this._log = createLogger(__filename);
    }

    public decodeToken(token: string): Partial<IIamToken> {
        if (token) {
            try {
                return decode(token) as Partial<IIamToken>;
            }
            catch (e) {
                this._log.error('Error while decoding the token');

            }
        }
    }
}
