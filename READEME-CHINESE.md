request-container (请求容器)
===========================================================
这个库非常精简只做两件事情:
1. 保证相同的HTTP请求在同一时间段内仅有一个请求.
2. 所有的HTTP请求都应该经过这个容器, 这样可以方便开发者在任何情况下
直接操作正在执行中的请求.

### 场景
1. 在面向组件的应用中, 如 react, vue, angular, 每一个组件应该独立完成自己的工作.
那么组件之间在绝大多数情况下是没有任何通信的. 那么如果任意2个或多个组件在几乎同一个时间内发出相同的http请求,
无疑是浪费网络资源和加大服务器的负重. 为了处理这个问题, <b>request-container(请求容器)保证同一个时刻有且仅有一个http请求, 
无论组件尝试发送多少请求.</b>

2. 对于单页面应用, 页面路由主要依赖Html 5 历史栈Api实现. 
但是任何发生在先前页面的请求会难以管理/取消 (因为要处理一大堆钩子去关联先前的请求). 试想想如果一个用户上传一个100mb的文件但由于
不耐烦不想等了点了后退按钮返回先前页面, 这个时候当前上传文件的请求仍然存在. <b>request-container(请求容器)提供了一个非常好的方式让开发者能
轻易管理到这些请求.</b>

### 适用环境

> NodeJS

> Browser

### 适用语言

> JavaScript

> Typescript

### 如何使用

开发者需要做的事情就是传入promise request到请求容器中并返回一个promiseState (promiseState代表着当前promise请求的4个状态分别
是<空>,<请求中>,<成功>,<失败>). 


##### Javascript

```javascript
    import RequestContainer from 'request-container';
    const requestContainer = RequestContainer.getInstance();

    // const promiseState = requestContainer.put(<a key used to identify your request>, 
    // <a function that will execute a request and return a promise>);
    const promiseState = requestContainer.put(JSON.stringify(requestParam), promiseFn);
```

##### Typescript

```typescript
    import RequestContainer from 'request-container';
    const requestContainer = RequestContainer.getInstance();

    //type RequestParamType = {url: 'www.example.com/api', data: {token:123}, method: 'get'};
    //promiseFn:() =>Promise<any>, e.g.  promiseFn = ()=>$.ajax(...);
    const promiseState = requestContainer.put(JSON.stringify(requestParam), promiseFn);
```


### Concurrent Same Request
Here is a scenario for concurrent same request (for more example please check the [tests folder](https://github.com/jf3096/request-conatiner/tree/master/tests))

```typescript
    import RequestContainer from 'request-container';
    
    function httpRequest(duration:number): Promise<void>{
       return new Promise(()=>setTimeout(resolve,number))
    }
    
    const requestContainer = RequestContainer.getInstance();
    
    //假设第一个请求请求2秒
    const requestParam1 = {url: 'www.example.com/api', data: {token:123}, method: 'get'};
    const promiseFn1 = ()=>httpRequest(2000);
    const promiseState1 = requestContainer.put(JSON.stringify(requestParam1), promiseFn1);
    
    //假设第二个请求4秒, 其实并没有关系, 因为第一个请求会决定这后面请求只会是2秒完成
    const requestParam2 = {url: 'www.example.com/api', data: {token:123}, method: 'get'};
    const promiseFn2 = ()=>httpRequest(4000);
    const promiseState2 = requestContainer.put(JSON.stringify(requestParam2), promiseFn2);
    
    /**
    * 由于他们使用相同参数请求, 那么我们可以认为他们是相同的请求. 所以如果<请求1>发出,
    * 请求2会被拦截, 并指向请求1, 也就是说他们两会共享同一个promise.
    * 那么这样就能确保整一个请求周期有且只有一个真正的对外请求
    */
```

### 后期
request-container(请求容器)会被作为我将要编写的下一个库的一个非常小的模块. 而下一个库会关于http请求缓存. 现在基本开发完成, 但卡在如果使用一个合理合适的方式去管理
缓存清理(GC). 下一个库完成后你会理解为什么request-container(请求容器)原理非常简单但是却是一个非常有容的模块.

### 单元测试
这个库已经通过较完善的[单元测试用例](https://github.com/jf3096/request-conatiner/tree/master/tests), 请放心使用:)

### 版权
MIT
