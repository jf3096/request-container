"use strict";
/**
 * Created by allen on 2016/11/24.
 */
var PromiseState_1 = require('../libs/PromiseState');
var chai_1 = require('chai');
var promiseFn = function () { return new Promise(function (resolve) {
    setTimeout(function () { return resolve('success'); }, 2000);
}); };
describe("class: PromiseState", function () {
    it('new PromiseState should pass', function (done) {
        var promiseState = new PromiseState_1.default(promiseFn);
        chai_1.expect(promiseState.isNone()).to.be.true;
        var status = promiseState.status;
        var counter = 0;
        Object.defineProperty(promiseState, 'status', {
            get: function () {
                return status;
            },
            set: function (val) {
                status = val;
                counter++;
                if (counter === 1) {
                    chai_1.expect(promiseState.isLoading()).to.be.true;
                }
                else if (counter === 2) {
                    chai_1.expect(promiseState.isSuccess()).to.be.true;
                }
            }
        });
        promiseState.exec().then(done, done);
    });
    it('new PromiseState should fail and throw if multiple exec', function () {
        var promiseState = new PromiseState_1.default(promiseFn);
        promiseState.exec();
        chai_1.expect(function () { return promiseState.exec(); }).to.throw("PromiseState.ts: current promise status is either loading or loaded. status = " + promiseState.status);
    });
});
//# sourceMappingURL=promiseState.spec.js.map