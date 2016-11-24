/**
 * Created by allen on 2016/11/24.
 */

export type IResponse = any;

interface PromiseState <T> {
    payload: T;
    status: PSEnum;
    error: Error;
}

export const enum PSEnum{
    none = 0,
    loading = 1,
    success = 2,
    error = 3
}

/**
 * this class is a wrapper that helps represent different data state
 */
class PromiseState<T> {

    public promise: Promise<T>;
    public error: Error;
    public payload: T;

    public constructor(private promiseFn: ()=>Promise<T>, public status = PSEnum.none) {
    }

    /**
     * perform the promise and pass value to corresponding class member
     */
    public exec(): Promise<IResponse> {
        /**
         * ensure the data state is at 'none'
         */
        if (this.isNone()) {
            this.status = PSEnum.loading;
            return this.promise = this.promiseFn().then((payload) => {
                this.payload = payload;
                this.status = PSEnum.success;
                return payload;
            }, (error) => {
                this.error = error;
                this.status = PSEnum.error;
                return error;
            });
        }
        throw `PromiseState.ts: current promise status is either loading or loaded. status = ${this.status}`;
    }

    /**
     * checks if current promise state is sending out a request
     */
    public isLoading() {
        return this.status === PSEnum.loading;
    }

    /**
     * checks if current promise state is error
     */
    public isError() {
        return this.status === PSEnum.error;
    }

    /**
     * checks if current promise state is success
     */
    public isSuccess() {
        return this.status === PSEnum.success
    }

    /**
     * checks if current promise state is initialized only
     */
    public isNone() {
        return this.status === PSEnum.none;
    }
}

export default PromiseState;