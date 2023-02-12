import { GLOBAL_API_PREFIX } from "./common/constants";

export class Env {
    static getGrpcIp(): string {
        return '0.0.0.0';
    }

    static getUserHttpPort(): number {
        return parseInt(process.env.HTTP_PORT || '8080', 10);
    }

    static getUserGrpcPort(): number {
        return parseInt(process.env.GRPC_PORT || '50051', 10);
    }

    static getApiUrl(): string {
        return process.env.GLOBAL_API_PREFIX || GLOBAL_API_PREFIX;
    }

}
