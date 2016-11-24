request-container
---------------------------------

This library is an extremely lightweight only do two things:

1. Same http requests should derive same result at the same range of time.

2. Every http requests should pass to a container so that developer could manage it anytime anywhere.

###Senarios
1. For any component oriented application such as react, vue, angular, each component works independently and isolately.
Therefore, if any two component dispatch same http request at around same time, mutiple same requests made. TO mitigate this,
<b>request-conatinersolves this problem to ensure all same requests are only made one and only one outgoing http request at same range of time.</b>

2. For Single Page Applications, they make use of Html5 History Api to manage routing. However, any requests that made in previous page might be
hard to manage/cancel. Imagine the performance when a user is uploading 100mb file and unpatiently leave the page, the 100mb file upload connection is
still there if developer not manually terminate it. <b>request-conatiner</b> solves this problem to as it provide a container to preserve processing request.

### Environment

> NodeJS
> Browser

### Language

> JavaScript
> Typescript

### How to use

> Javascript

```javascript
    import RequestContainer from 'request-container';
    const requestContainer = RequestContainer.getInstance();

    // const promiseState = requestContainer.put(<a key used to identify your request>, 
    // <a function that will execute a request and return a promise>);
    const promiseState = requestContainer.put(JSON.stringify(requestParam), promiseFn);
```

> Typescript

```typescript
    import RequestContainer from 'request-container';
    const requestContainer = RequestContainer.getInstance();

    //type RequestParamType = {url: string, data: any,method: 'get'|'post'};
    const promiseState = requestContainer.put(JSON.stringify(requestParam: RequestParamType), promiseFn: () =>Promise<any>);
```
