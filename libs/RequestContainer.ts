/**
 * Created by allen on 2016/11/17.
 */
import PromiseState, {IResponse} from './PromiseState';

/**
 * a helper function indicates a promise complete callback
 */
function completeWrapper<T>(promise: Promise<T>) {
    return {
        complete: (action: Function) => {
            return promise.then((response) => {
                action && action();
                return response;
            }, (error) => {
                action && action();
                return error;
            });
        }
    }
}

class RequestContainer<T> {

    /**
     * Singleton instance
     */
    private static instance: RequestContainer<any>;

    /**
     * Singleton lazy initializer
     */
    public static getInstance() {
        if (!RequestContainer.instance) {
            RequestContainer.instance = new RequestContainer();
        }
        return RequestContainer.instance;
    }

    /**
     * this container is used to store promise state
     */
    public container: {[key: number]: PromiseState<T>};

    private constructor() {
        this.container = {};
    }

    public put(key: string, promiseFn: ()=>Promise<IResponse>): PromiseState<T> {
        /**
         * check if the container has a same promise state
         */
        const isExist = this.verifyIfExist(key);

        if (isExist) {
            /**
             * directly return a promise state that's in the request container
             * this is useful if multiple same http requests are made at the same time,
             * it will only make one outgoing request as the rest will point to the same promise state
             */
            return this.getPromiseState(key);
        }

        /**
         * not found, make request via promise state which is a wrapper
         */
        const promiseState = RequestContainer.executePromise(promiseFn);

        /**
         * place it in the container to indicate the request is sent and is waiting for response
         */
        this.container[key] = promiseState;

        /**
         * whenever the request completes, remove it from request container
         */
        completeWrapper(promiseState.promise).complete(() => {
            this.container[key] = void 0;
        });

        return promiseState;
    }

    /**
     * create a wrapper and make a request
     * @returns {PromiseState<IResponse>} return the wrapper
     */
    private static executePromise(promiseFn: ()=>Promise<IResponse>) {
        const promiseState = new PromiseState(promiseFn);
        promiseState.exec();
        return promiseState;
    }

    /**
     * a helper represent request container has a promise state
     */
    private verifyIfExist(key: string): boolean {
        return !!this.getPromiseState(key);
    }

    /**
     * a request container getter
     */
    private getPromiseState(key: string): PromiseState<T> {
        return this.container[key];
    }
}

export default RequestContainer;

