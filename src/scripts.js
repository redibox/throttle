/**
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Salakar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

export default {

  throttle: {
    keys: 1,
    lua: `
        --[[
          key 1 -> key name - ip, user id or some unique key to throttle X by
          arg 1 -> limit
          arg 2 -> seconds

          returns {
            throttled: ->  1 if should throttle, 0 if still within limit
            remaining: ->  how many reqs left until throttled,
            ttl:       ->  seconds remaining until limit resets
          }
        ]]

        local count = redis.call('INCR', KEYS[1])
        local ttl = redis.call('ttl',KEYS[1])

        if count == 1 or ttl == -1 then
          redis.call('EXPIRE', KEYS[1], ARGV[2])
        end

        if ttl == -1 then
          ttl = tonumber(ARGV[2])
        end

        if count > tonumber(ARGV[1]) then
          return {1,0,ttl}
        end

        return {0,tonumber(ARGV[1]) - count,ttl}
  `,
  },

  pThrottle: {
    keys: 1,
    lua: `
        --[[
          key 1 -> key name - ip, user id or some unique key to throttle X by
          arg 1 -> limit
          arg 2 -> milliseconds

          returns 0 if request is ok
          returns 1 if request denied
        ]]

        local count = redis.call('INCR', KEYS[1])
        local pttl = redis.call('pttl',KEYS[1])

        if count == 1 or pttl == -1 then
          redis.call('PEXPIRE', KEYS[1], ARGV[2])
        end

        if pttl == -1 then
          pttl = tonumber(ARGV[2])
        end

        if count > tonumber(ARGV[1]) then
          return {1,0,pttl}
        end

        return {0,tonumber(ARGV[1]) - count,pttl}
  `,
  },
};
