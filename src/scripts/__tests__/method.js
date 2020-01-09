const { isArr } = require('../array')
const { isStr } = require('../string')
const Method = require('../method')

const promiseHelper = isValid => new Promise((res, rej) => {
  setTimeout(() => {
    isValid
      ? res(`Promise Valid`)
      : rej(new Error(`Promise Error`))
  }, 100)
})

const promiseError = isValid => new Promise((res, rej) => {
  setTimeout(() => {
    throw new Error(`Promise Error`)
  }, 100)
})

describe('/method', () => {

  beforeEach(() => jest.resetAllMocks())

  describe('checkCall', () => {

    it('should check if a method, and call it with passed in params', () => {
      const testMethod = jest.fn(() => {})
      Method.checkCall(testMethod, 1,2,3)
      expect(testMethod).toHaveBeenCalledWith(1,2,3)
    })

    it('should not try to call a method if its not a function', () => {
      expect(Method.checkCall(null, 1,2,3)).toEqual(undefined)
    })

  })

  describe('debounce', () => {

    it('should call the passed method after the correct amount of time', done => {
      const testMethod = jest.fn(() => {})
      const boundMethod = Method.debounce(testMethod, 100)
      boundMethod()

      setTimeout(() => {
        expect(testMethod).not.toHaveBeenCalled()
      }, 99)
      setTimeout(() => {
        expect(testMethod).toHaveBeenCalled()
        done()
      }, 101)
    })

    it('should use 250 as default wait time when not wait time is passed', done => {
      const testMethod = jest.fn(() => {})
      const boundMethod = Method.debounce(testMethod)
      boundMethod()

      setTimeout(() => {
        expect(testMethod).not.toHaveBeenCalled()
      }, 50)
      setTimeout(() => {
        expect(testMethod).toHaveBeenCalled()
        done()
      }, 251)
    })

    it('should call immediately is passed in as true', done => {
      const testMethod = jest.fn(() => {})
      const boundMethod = Method.debounce(testMethod, 300)
      boundMethod()
      const nowMethod = Method.debounce(testMethod, 300, true) 
     
      setTimeout(() => {
        expect(testMethod).not.toHaveBeenCalled()
        nowMethod()
        expect(testMethod).toHaveBeenCalled()
        done()
      }, 50)
    })

    it('should not try to call the fun if a fun is not passed in', () => {
      const testMethod = jest.fn(() => {})
      const boundMethod = Method.debounce(undefined)

      expect(boundMethod()).toEqual(null)
    })

  })

  describe('doIt', () => {

    it('should execute the callback n times based on passed in param', () => {
      const callback = jest.fn((index, arr, data) => arr.push(index))
      Method.doIt(5, global, [], callback)

      expect(callback).toHaveBeenCalledTimes(5)
    })

    it('should stop call the callback when the last callback returned false', () => {
      let isBound
      const callback = jest.fn((index, arr, data) => { return false })
      Method.doIt(3, global, [], callback)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should keep calling the callback when the callback returns falsy but not false', () => {
      let isBound
      const callback = jest.fn((index, arr, data) => { return undefined })
      Method.doIt(3, global, [], callback)

      expect(callback).toHaveBeenCalledTimes(3)
    })

    it('should return an array of response from the return of the callback', () => {
      let isBound
      const callback = jest.fn((index, arr, data) => { return Math.floor(Math.random() * 10) })
      const responses = Method.doIt(3, global, [], callback)
      
      expect(isArr(responses)).toBe(true)
      expect(responses.length).toBe(3)
    })

    it('should bind the callback to the second argument', () => {
      let isBound
      const callback = jest.fn(function(index, arr, data){ isBound = this === global })
      Method.doIt(1, global, [], callback)

      expect(isBound).toBe(true)
    })

    it('should pass all arguments to the callback after first 2, and exclude the last', () => {
      let has1
      let has2
      let has3
      const callback = jest.fn((index, is1, is2, is3) => {
        has1 = is1
        has2 = is2
        has3 = is3
      })
      Method.doIt(1, global, 1, 2, 3, callback)
      
      expect(has1).toBe(1)
      expect(has2).toBe(2)
      expect(has3).toBe(3)
    })

  })

  describe('isFunc', () => {

    it('should return true when passed in parm is a function', () => {
      expect(Method.isFunc(jest.fn())).toEqual(true)
    })

    it('should return false when passed in parm is not a function', () => {
      expect(Method.isFunc(null)).toEqual(false)
    })

  })

  describe('memorize', () => {

    it('should return a function', () => {
      
    })

    it('should return the last response to a method when params are the same', () => {
      
    })

    it('should set the response to the memorize cache', () => {
      
    })

    it('should clear the cache when memorize.destroy is called', () => {
      
    })

  })

  describe('throttle', () => {

    it('should only call the passed in method once over a given amount of time', () => {
      
    })

  })
  
  describe('throttleLast', () => {

    it('should only call the last method passed to it', () => {
      
    })

  })

  describe('limbo', () => {

    it('should return an array with the length of 2', async (done) => {
      const response = await Method.limbo(promiseHelper(true))

      expect(typeof response).toBe('object')
      expect(isArr(response)).toBe(true)
      expect(response.length).toBe(2)

      done()
    })

    it('should return an error for first slot when the promise is rejected', async (done) => {
      const [ err, data ] = await Method.limbo(promiseHelper(false))

      expect(err instanceof Error).toBe(true)
      expect(err.message).toEqual(`Promise Error`)

      done()
    })

    it('should return null for first slot when an error is not throw', async (done) => {
      const [ err, data ] = await Method.limbo(promiseHelper(true))

      expect(err).toBe(null)

      done()
    })

    it('should return promise response for second slot when error is not throw', async (done) => {
      const [ err, data ] = await Method.limbo(promiseHelper(true))

      expect(data).toEqual(`Promise Valid`)

      done()
    })

    it('should return an error for first slot when no promise is passed in', async (done) => {
      const [ err, data ] = await Method.limbo()

      expect(err instanceof Error).toBe(true)

      done()
    })

    it('should return an error for first slot when an error is thrown', async (done) => {
      const [ err, data ] = await Method.limbo()

      expect(err instanceof Error).toBe(true)

      done()
    })

  })

  describe('uuid', () => {

    it('should return a valid uuid', () => {
      const uuid = Method.uuid()
      if (!uuid || typeof uuid !== 'string') return false
      const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      const isValid =  regex.test(uuid)
      
      expect(typeof uuid).toEqual('string')
      expect(isValid).toEqual(true)
    })

    it('should not return uuids that are the same', () => {
      const uuid = Method.uuid()
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(uuid).not.toEqual(Method.uuid())
      expect(Method.uuid()).not.toEqual(Method.uuid())
    })

  })

  describe('pipeline', () => {
    const square = (x) => x * x
    const subtractBy = (x, y) => x - y
    const startingValue = 2
    it('should return the value run through the pipeline', () => {
      const result = Method.pipeline(
        startingValue,
        (num) => num + 1,
        square
      )

      expect(result).toEqual(9)
    })

    it('should work with array expressions', () => {
      const result = Method.pipeline(
        2,
        square,
        [subtractBy, 5] // take the square of 2 and subtract 5 from it
      )
      expect(result).toEqual(-1)
    })

    it('should NOT call its first argument, if it is a function', () => {
      const result = Method.pipeline(() => 2, (x) => x() * 10)
      expect(result).toEqual(20)
    })

    it('should return the element if no functions are specified', () => {
      const element = "foo"
      const result = Method.pipeline(element)
      expect(result).toEqual(element)
    })

    it('should log errors if it encountered an invalid expression', () => {
      const orgError = console.error
      console.error = jest.fn()
      expect(Method.pipeline(1, square, "invalid expression")).toEqual(1)
      expect(console.error).toHaveBeenCalled()
      console.error = orgError
    })
  })
})

describe('match', () => {
  it ('should match the first matching case', () => {
    const expectedResult = 55

    const matchArg = 'wow'
    const result = Method.match(
      matchArg, 
      [ 'whoa', () => 1 ],
      [ 'wow', expectedResult ]
    )

    expect(result).toEqual(expectedResult)
  })

  it ('should work with predicate functions as the matching value', () => {
    const expectedResult = 22
    const result = Method.match(
      'fooby',
      [ isStr, expectedResult],
      [ isArr, 55 ]
    )
    expect(result).toEqual(expectedResult)
  })

  it ('should default to null if no matches were valid', () => {
    const result = Method.match(
      'fooby',
      [ isArr, 12],
      [ 'barbaz', 55 ]
    )
    expect(result).toBeNull()
  })

  it ('should return null and console error if a case is not an entry', () => {
    const orig = console.error
    console.error = jest.fn()
    const result = Method.match(
      'fooby',
      'wow'
    )
    expect(console.error).toHaveBeenCalled()
    expect(result).toBeNull()
    console.error = orig
  })
})

describe('isValid', () => {
  it ('should validate all entries, returning true if all are valid', () => {
    const value = 3
    const isValid = Method.isValid(
      [ value === 3, 'Error message'],
      [ value > 2, 'Error message'],
      [ value !== 1, 'Error message'],
    )
    expect(isValid).toBe(true)
  })

  it ('should return false on the first failure, and it should error log that failure', () => {
    const orig = console.error
    console.error = jest.fn()
    
    const value = 3
    const errorLogArgs = ['My message:', 'continued']
    const isValid = Method.isValid(
      [ value === 3, 'Error message'],
      [ value < 2, ...errorLogArgs],
      [ value < 1, 'message not used'],
    )
    expect(isValid).toBe(false)
    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(...errorLogArgs)

    console.error = orig
  })
})