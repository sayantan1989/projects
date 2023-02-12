import { IIamToken } from '../common/iam-token/IIamToken';
import { ICorrelation } from './ICorrelation';

export interface ISession extends ICorrelation {
    decodedIamToken?: Partial<IIamToken>;
    jwtToken?: string;
    clientIp?: string;
}