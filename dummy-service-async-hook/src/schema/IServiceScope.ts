
import { Mongoose } from 'mongoose';

export interface IServiceScope {
    mongoClient?: Mongoose;
}