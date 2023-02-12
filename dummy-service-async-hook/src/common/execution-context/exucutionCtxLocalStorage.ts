import { AsyncLocalStorage } from 'async_hooks';

class LocalStorage implements IExecutionContextLocalStorage {
    private _asyncLocalStorage: AsyncLocalStorage<any>;

    constructor() {
        this._asyncLocalStorage = new AsyncLocalStorage();
    }

    setExecutionCtx(data: any, callbackFn: (...arg: any[]) => any): void {
        this._asyncLocalStorage.run(data, callbackFn);
    }

    getExecutionCtx(): any {
        return this._asyncLocalStorage.getStore();
    }

    destroy(): void {
        this._asyncLocalStorage.disable();
    }


}

export const executionCtxLocalStorage: IExecutionContextLocalStorage = new LocalStorage();