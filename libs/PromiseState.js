/**
 * Created by allen on 2016/11/24.
 */
"use strict";
/**
 * this class is a wrapper that helps represent different data state
 */
var PromiseState = (function () {
    function PromiseState(promiseFn, status) {
        if (status === void 0) { status = 0 /* none */; }
        this.promiseFn = promiseFn;
        this.status = status;
    }
    /**
     * perform the promise and pass value to corresponding class member
     */
    PromiseState.prototype.exec = function () {
        var _this = this;
        /**
         * ensure the data state is at 'none'
         */
        if (this.isNone()) {
            this.status = 1 /* loading */;
            return this.promise = this.promiseFn().then(function (payload) {
                _this.payload = payload;
                _this.status = 2 /* success */;
                return payload;
            }, function (error) {
                _this.error = error;
                _this.status = 3 /* error */;
                return error;
            });
        }
        throw "PromiseState.ts: current promise status is either loading or loaded. status = " + this.status;
    };
    /**
     * checks if current promise state is sending out a request
     */
    PromiseState.prototype.isLoading = function () {
        return this.status === 1 /* loading */;
    };
    /**
     * checks if current promise state is error
     */
    PromiseState.prototype.isError = function () {
        return this.status === 3 /* error */;
    };
    /**
     * checks if current promise state is success
     */
    PromiseState.prototype.isSuccess = function () {
        return this.status === 2 /* success */;
    };
    /**
     * checks if current promise state is initialized only
     */
    PromiseState.prototype.isNone = function () {
        return this.status === 0 /* none */;
    };
    return PromiseState;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PromiseState;
//# sourceMappingURL=PromiseState.js.map