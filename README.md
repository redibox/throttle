[![Coverage Status](https://coveralls.io/repos/github/redibox/throttle/badge.svg?branch=master)](https://coveralls.io/github/redibox/throttle?branch=master)
![Downloads](https://img.shields.io/npm/dt/redibox-hook-throttle.svg)
[![npm version](https://img.shields.io/npm/v/redibox-hook-throttle.svg)](https://www.npmjs.com/package/redibox-hook-throttle)
[![dependencies](https://img.shields.io/david/redibox/throttle.svg)](https://david-dm.org/redibox/throttle)
[![build](https://travis-ci.org/redibox/throttle.svg)](https://travis-ci.org/redibox/throttle)
[![License](https://img.shields.io/npm/l/redibox-hook-throttle.svg)](/LICENSE)

## RediBox Throttle

Provides `throttle` and `pThrottle` lua scripts for [RediBox](https://github.com/redibox/core) redis clients. 

### Installation
---
```bash
npm i redibox-hook-throttle --save
```

No configuration required.

### API
---

### client.throttle(key, limit, seconds)

**Args**:
 - **key** - key name - ip, user id or some unique key to throttle X by
 - **limit** - limit amount, e.g. '20' requests
 - **seconds** - ttl in secondsof this limit, i.e, '60' - 20 requests per 60 seconds.

**Returns**:
 - ARRAY
  - **[0] throttled**: ->  1 if you should throttle/reject this request, 0 if still within limit
  - **[1] remaining**: ->  how many times left until throttled, i.e. 11 requests left
  - **[2] ttl**: -> seconds remaining until limit resets


**Example**:

In this example we have an express api server and we want to limit each user to no more than 10 requests per minute. We can use throttle in a middleware to achieve this.

```javascript
const app = express();

app.use((req, res, next) => {
  RediBox.client
    .throttle(
      // key based on user id for uniqueness or some other identifier
      `throttle:${req.param('userId')}`,
      // 10 requests
      10, 
      // per 60 seconds
      60
    ).then((result) => {
      const throttled = result[0];
      const remainingRequests = result[1];
      const expiresInSeconds = result[2];
      
      if (throttled) {
        return res.status(429).json({
          msg: `You have made too many requests recently, please try again in ${expiresInSeconds} seconds.`,
        });
      }
      
      // if we want it later on in the request
      req.throttle = {
        remainingRequests,
        expiresInSeconds
      };
      
      // we're all good here so allow user to continue
      next();
    }).catch(next);
});
```

### client.pthrottle(key, limit, milliseconds)

`pThrottle` is exactly the same as `throttle` but uses millisecond precision instead of seconds.
