/**
 * Created by allen on 2016/11/24.
 */
import RequestContainer from '../libs/RequestContainer';
import {expect} from 'chai';
import objectAssign = require('object-assign');

type RequestParamType = {url: string, data: any,method: 'get'|'post'};

const promiseFn = (requestParam: RequestParamType, timeoutDuration: number) => {
    const initTime = +new Date();
    return () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(initTime), timeoutDuration);
        });
    };
};

const requestContainer = RequestContainer.getInstance();

describe(`class: RequestContainer`, () => {
    it('new RequestContainer should return same init time as they are the same request at same range of time', (done) => {
        const requestParam: RequestParamType = {url: `http://www.example.com/api`, data: {token: 123}, method: 'get'};
        const timeoutDuration = 1500;
        const promiseState1 = requestContainer.put(JSON.stringify(requestParam), promiseFn(requestParam, timeoutDuration));
        setTimeout(() => {
            const promiseState2 = requestContainer.put(JSON.stringify(requestParam), promiseFn(requestParam, timeoutDuration));
            Promise.all([promiseState1.promise, promiseState2.promise]).then((result) => {
                expect(result[0]).to.be.eqls(result[1]);
                done();
            });
        }, 1000);
    });
    it('new RequestContainer should return same init time as they are the same request at same range of time', (done) => {
        const requestParam: RequestParamType = {url: `http://www.example.com/api`, data: {token: 123}, method: 'get'};
        const timeoutDuration = 1000;
        const promiseList = [];
        for (let counter = 0; counter < 10; counter++) {
            promiseList.push(new Promise((resolve) => {
                setTimeout(() => {
                    const promiseState = requestContainer.put(JSON.stringify(requestParam), promiseFn(requestParam, timeoutDuration));
                    resolve(promiseState.promise);
                }, counter * 100);
            }))
        }
        Promise.all(promiseList).then((results) => {
            const firstResult = results[0];
            const any = results.every((result) => result == firstResult);
            expect(any).to.be.eqls(true);
            done();
        });
    });
    it('new RequestContainer should not return same init time if they are the same request in separate period of time', (done) => {
        const requestParam: RequestParamType = {url: `http://www.example.com/api`, data: {token: 123}, method: 'get'};
        const timeoutDuration = 100;
        const promiseList = [];
        for (let counter = 0; counter < 10; counter++) {
            promiseList.push(new Promise((resolve) => {
                setTimeout(() => {
                    const promiseState = requestContainer.put(JSON.stringify(requestParam), promiseFn(requestParam, timeoutDuration));
                    resolve(promiseState.promise);
                }, counter * 110);
            }))
        }
        Promise.all(promiseList).then((results) => {
            const firstResult = results[0];
            const any = results.slice(1, results.length).every((result) => {
                return result != firstResult
            });
            expect(any).to.be.eqls(true);
            done();
        });
    });
    it('new RequestContainer should not return same init time if they are NOT the same request at same range of time', (done) => {
        const requestParam: RequestParamType = {url: `http://www.example.com/api`, data: {token: 123}, method: 'get'};
        const timeoutDuration = 1000;
        const promiseList = [];
        for (let counter = 0; counter < 10; counter++) {
            promiseList.push(new Promise((resolve) => {
                const newRequest = objectAssign({}, requestParam, {token: counter});
                setTimeout(() => {
                    const promiseState = requestContainer.put(JSON.stringify(newRequest), promiseFn(newRequest, timeoutDuration));
                    resolve(promiseState.promise);
                }, counter * 50);
            }))
        }
        Promise.all(promiseList).then((results) => {
            const firstResult = results[0];
            const any = results.slice(1, results.length).every((result) => {
                return result != firstResult;
            });
            expect(any).to.be.eqls(true);
            done();
        });
    });
});