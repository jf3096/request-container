/**
 * Created by allen on 2016/11/24.
 */
import PromiseState from '../libs/PromiseState';
import {expect} from 'chai';


const promiseFn = () => new Promise((resolve) => {
    setTimeout(() => resolve('success'), 2000);
});

describe(`class: PromiseState`, () => {
    it('new PromiseState should pass', (done) => {
        const promiseState = new PromiseState(promiseFn);
        expect(promiseState.isNone()).to.be.true;
        let status = promiseState.status;
        let counter = 0;
        Object.defineProperty(promiseState, 'status', {
            get: () => {
                return status;
            },
            set: (val) => {
                status = val;
                counter++;
                if (counter === 1) {
                    expect(promiseState.isLoading()).to.be.true;
                }
                else if (counter === 2) {
                    expect(promiseState.isSuccess()).to.be.true;
                }
            }
        });
        promiseState.exec().then(done, done);
    });

    it('new PromiseState should fail and throw if multiple exec', () => {
        const promiseState = new PromiseState(promiseFn);
        promiseState.exec();
        expect(() => promiseState.exec()).to.throw(`PromiseState.ts: current promise status is either loading or loaded. status = ` + promiseState.status);
    });
});