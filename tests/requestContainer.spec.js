"use strict";
/**
 * Created by allen on 2016/11/24.
 */
var RequestContainer_1 = require('../libs/RequestContainer');
var chai_1 = require('chai');
var objectAssign = require('object-assign');
var promiseFn = function (requestParam, timeoutDuration) {
    var initTime = +new Date();
    return function () {
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(initTime); }, timeoutDuration);
        });
    };
};
var requestContainer = RequestContainer_1.default.getInstance();
describe("class: RequestContainer", function () {
    it('new RequestContainer should return same init time as they are the same request at same range of time', function (done) {
        var requestParam = { url: "http://www.example.com/api", data: { token: 123 }, method: 'get' };
        var timeoutDuration = 1500;
        var promiseState1 = requestContainer.put(JSON.stringify(requestParam), promiseFn(requestParam, timeoutDuration));
        setTimeout(function () {
            var promiseState2 = requestContainer.put(JSON.stringify(requestParam), promiseFn(requestParam, timeoutDuration));
            Promise.all([promiseState1.promise, promiseState2.promise]).then(function (result) {
                chai_1.expect(result[0]).to.be.eqls(result[1]);
                done();
            });
        }, 1000);
    });
    it('new RequestContainer should return same init time as they are the same request at same range of time', function (done) {
        var requestParam = { url: "http://www.example.com/api", data: { token: 123 }, method: 'get' };
        var timeoutDuration = 1000;
        var promiseList = [];
        var _loop_1 = function(counter) {
            promiseList.push(new Promise(function (resolve) {
                setTimeout(function () {
                    var promiseState = requestContainer.put(JSON.stringify(requestParam), promiseFn(requestParam, timeoutDuration));
                    resolve(promiseState.promise);
                }, counter * 100);
            }));
        };
        for (var counter = 0; counter < 10; counter++) {
            _loop_1(counter);
        }
        Promise.all(promiseList).then(function (results) {
            var firstResult = results[0];
            var any = results.every(function (result) { return result == firstResult; });
            chai_1.expect(any).to.be.eqls(true);
            done();
        });
    });
    it('new RequestContainer should not return same init time if they are the same request in separate period of time', function (done) {
        var requestParam = { url: "http://www.example.com/api", data: { token: 123 }, method: 'get' };
        var timeoutDuration = 100;
        var promiseList = [];
        var _loop_2 = function(counter) {
            promiseList.push(new Promise(function (resolve) {
                setTimeout(function () {
                    var promiseState = requestContainer.put(JSON.stringify(requestParam), promiseFn(requestParam, timeoutDuration));
                    resolve(promiseState.promise);
                }, counter * 110);
            }));
        };
        for (var counter = 0; counter < 10; counter++) {
            _loop_2(counter);
        }
        Promise.all(promiseList).then(function (results) {
            var firstResult = results[0];
            var any = results.slice(1, results.length).every(function (result) {
                return result != firstResult;
            });
            chai_1.expect(any).to.be.eqls(true);
            done();
        });
    });
    it('new RequestContainer should not return same init time if they are NOT the same request at same range of time', function (done) {
        var requestParam = { url: "http://www.example.com/api", data: { token: 123 }, method: 'get' };
        var timeoutDuration = 1000;
        var promiseList = [];
        var _loop_3 = function(counter) {
            promiseList.push(new Promise(function (resolve) {
                var newRequest = objectAssign({}, requestParam, { token: counter });
                setTimeout(function () {
                    var promiseState = requestContainer.put(JSON.stringify(newRequest), promiseFn(newRequest, timeoutDuration));
                    resolve(promiseState.promise);
                }, counter * 50);
            }));
        };
        for (var counter = 0; counter < 10; counter++) {
            _loop_3(counter);
        }
        Promise.all(promiseList).then(function (results) {
            var firstResult = results[0];
            var any = results.slice(1, results.length).every(function (result) {
                return result != firstResult;
            });
            chai_1.expect(any).to.be.eqls(true);
            done();
        });
    });
});
//# sourceMappingURL=requestContainer.spec.js.map