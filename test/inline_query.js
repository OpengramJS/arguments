const test = require('ava')
const args = require('../src')
const Joi = require('joi')
const { ValidationError } = require('joi')

function createContext () {
  const query = 'first second'
  const context = {
    updateType: 'inline_query',
    updateSubTypes: [],
    state: {},
    inline_query: {
      query
    }
  }
  return { context, query }
}

test('should parse arguments', async t => {
  const { context } = createContext()

  const middleware = args()
  middleware(context, Function.prototype)
  t.deepEqual(context.state.args.raw, ['first', 'second'])
})

test('should remap arguments', async t => {
  const { context } = createContext()

  const middleware = args({ mapping: ['firstArg', 'secondArg'] })
  middleware(context, Function.prototype)
  t.deepEqual(context.state.args.raw, ['first', 'second'])
  t.deepEqual(context.state.args.result, { firstArg: 'first', secondArg: 'second' })
})

test('should remap and validate arguments', async t => {
  const { command, context } = createContext()

  const schema = Joi.object({
    firstArg: Joi.string()
      .equal('first')
      .required(),
    secondArg: Joi.string()
      .equal('second')
      .required()
  })

  const middleware = args({ mapping: ['firstArg', 'secondArg'], schema })
  middleware(context, Function.prototype)

  t.deepEqual(context.state.args.raw, ['first', 'second'])
  t.deepEqual(context.state.args.result, { firstArg: 'first', secondArg: 'second' })
})

test('should remap and throw error when validation failed', async t => {
  const { context } = createContext()

  const schema = Joi.object({
    firstArg: Joi.string()
      .equal('second')
      .required(),
    secondArg: Joi.string()
      .equal('first')
      .required()
  })

  await t.throws(() => {
    const middleware = args({ mapping: ['firstArg', 'secondArg'], schema })
    middleware(context, Function.prototype)
  }, { instanceOf: ValidationError })
})

test('should call errorHandler when validate failed', async t => {
  t.plan(3)
  const { context } = createContext()

  const schema = Joi.object({
    firstArg: Joi.string()
      .equal('second')
      .required(),
    secondArg: Joi.string()
      .equal('first')
      .required()
  })

  await t.notThrowsAsync(async () => {
    return new Promise((resolve) => {
      const middleware = args({
        mapping: ['firstArg', 'secondArg'],
        schema,
        errorHandler: (err, ctx) => {
          t.is(err instanceof ValidationError, true)
          t.deepEqual(ctx, context)
          resolve()
        }
      })
      middleware(context, Function.prototype)
    })
  })
})
