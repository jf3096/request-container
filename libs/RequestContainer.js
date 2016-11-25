"use strict";
/**
 * Created by allen on 2016/11/17.
 */
var PromiseState_1 = require('./PromiseState');
/**
 * a helper function indicates a promise complete callback
 */
function completeWrapper(promise) {
    return {
        complete: function (action) {
            return promise.then(function (response) {
                action && action();
                return response;
            }, function (error) {
                action && action();
                return error;
            });
        }
    };
}
var RequestContainer = (function () {
    function RequestContainer() {
        this.container = {};
    }
    /**
     * Singleton lazy initializer
     */
    RequestContainer.getInstance = function () {
        if (!RequestContainer.instance) {
            RequestContainer.instance = new RequestContainer();
        }
        return RequestContainer.instance;
    };
    RequestContainer.prototype.put = function (key, promiseFn) {
        var _this = this;
        /**
         * check if the container has a same promise state
         */
        var isExist = this.verifyIfExist(key);
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
        var promiseState = RequestContainer.executePromise(promiseFn);
        /**
         * place it in the container to indicate the request is sent and is waiting for response
         */
        this.container[key] = promiseState;
        /**
         * whenever the request completes, remove it from request container
         */
        completeWrapper(promiseState.promise).complete(function () {
            _this.remove(key);
        });
        return promiseState;
    };
    /**
     * create a wrapper and make a request
     * @returns {PromiseState<IResponse>} return the wrapper
     */
    RequestContainer.executePromise = function (promiseFn) {
        var promiseState = new PromiseState_1.default(promiseFn);
        promiseState.exec();
        return promiseState;
    };
    /**
     * clear the container and return all the promise state
     * the return values allow developer to further process it such as cancel all the promise
     */
    RequestContainer.prototype.clear = function () {
        var promiseStates = [];
        for (var key in this.container) {
            var promiseState = this.container[key];
            this.remove(key);
            promiseStates.push(promiseState);
        }
        return promiseStates;
    };
    /**
     * remove item from container
     */
    RequestContainer.prototype.remove = function (key) {
        delete this.container[key];
    };
    /**
     * a helper represent request container has a promise state
     */
    RequestContainer.prototype.verifyIfExist = function (key) {
        return !!this.getPromiseState(key);
    };
    /**
     * a request container getter
     */
    RequestContainer.prototype.getPromiseState = function (key) {
        return this.container[key];
    };
    return RequestContainer;
}());
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = RequestContainer;
//# sourceMappingURL=RequestContainer.js.map