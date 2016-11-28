request-container
===========================================================

[Chinese README (中文文档)](https://github.com/jf3096/request-conatiner/tree/master/README/CHINESE-README.md)

This library is an extremely lightweight only do two things:

1. Same http requests should derive same result with only one outgoing request at the same range of time.

2. Every http requests should pass to a container so that developer could manage it anytime anywhere.

### Senarios
1. For any component oriented application such as react, vue, angular, each component works independently and isolately.  There shouldn't be any communication between any two components in most cases.
Therefore, if any two component dispatches same http request at around same time, mutiple same requests will make and as a result wasted network resources and burden of server. To mitigate this,
<b>request-conatiner ensures all same requests are only made one and only one outgoing http request at same range of time.</b>

2. For Single Page Applications, they make use of Html5 History Api to manage routing. However, any requests that made in previous page might be
hard to manage/cancel. Imagine the performance when a user is uploading a 100mb file and unpatiently leave the page, the 100mb file upload connection is
still there if developer not manually terminate it. <b>request-conatiner solves this problem to as it provide a place where developer can reach all processing requests easily.</b>

### Environment

> NodeJS

> Browser

### Language

> JavaScript

> Typescript

### How to use

What you need to do is to pass your promise request in the request container and it will return you a promiseState which contains
your promise as well as current promise request status (none/loading/success/error).

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
    
    //assume first attempt request consumes 2 sec
    const requestParam1 = {url: 'www.example.com/api', data: {token:123}, method: 'get'};
    const promiseFn1 = ()=>httpRequest(2000);
    const promiseState1 = requestContainer.put(JSON.stringify(requestParam1), promiseFn1);
    
    //assume second attempt request consumes 4 sec, it doesn't matter how long it takes
    const requestParam2 = {url: 'www.example.com/api', data: {token:123}, method: 'get'};
    const promiseFn2 = ()=>httpRequest(4000);
    const promiseState2 = requestContainer.put(JSON.stringify(requestParam2), promiseFn2);
    
    /**
    * since they are exactly the same request, therefore if request1 sent
    * request2 will be intercepted and points to request1, which means request1 will share the response with request2
    * the entire process therefore will have one and only one outgoing request.
    */
```

### Roadmap
The request-container will be used as a small part of module in next library which is about smart http request caching. I am stuck at how to create a suitable algorithm to handle cache garbage collection (GC). Once done, it will make more sense of why
request-container is simple but very useful for any request module for any project.

### Unit Testing
This library has been gone through proper unit testing under the [tests folder](https://github.com/jf3096/request-conatiner/tree/master/tests), feel free to use the request-container :)

### License
MIT
