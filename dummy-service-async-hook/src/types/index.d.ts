/* eslint-disable no-var */
declare global {
    var executionContextLocalStorage: IExecutionContextLocalStorage;
    interface IExecutionContextLocalStorage {
        setExecutionCtx: (data: any, callbackFn: (...args: any[]) => any) => void;
        getExecutionCtx: () => any;
        destroy: () => void;
    }
}
export { };
