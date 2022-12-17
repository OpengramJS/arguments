const test = require('ava')
const args = require('../src')
const Joi = require('joi')
const { ValidationError } = require('joi')
const { Composer } = require('opengram')
const { createContext } = require('./utils')

test('should not throw when args not given', async t => {
  const { context } = createContext({
    text: '/start',
    type: 'message'
  })

  const middleware = args()
  await middleware(context, Composer.safePassThru())

  t.deepEqual(context.state.args.result, {})
  t.deepEqual(context.state.args.raw, [])
})

test('should not throw when command entities not given', async t => {
  const { context } = createContext({
    text: 'text',
    entities: false,
    type: 'message'
  })

  const middleware = args()
  await middleware(context, Composer.safePassThru())

  t.deepEqual(context.state.args.result, {})
  t.deepEqual(context.state.args.raw, [])
})

test('should parse arguments', async t => {
  const { context } = createContext({
    type: 'message'
  })

  const middleware = args()
  await middleware(context, Composer.safePassThru())

  t.deepEqual(context.state.args.raw, ['first', 'second'])
})

test('should remap arguments', async t => {
  const { context } = createContext({
    type: 'message'
  })

  const middleware = args({ mapping: ['firstArg', 'secondArg'] })
  await middleware(context, Composer.safePassThru())

  t.deepEqual(context.state.args.raw, ['first', 'second'])
  t.deepEqual(context.state.args.result, { firstArg: 'first', secondArg: 'second' })
})

test('should remap and validate arguments', async t => {
  const { context } = createContext({
    type: 'message'
  })

  const schema = Joi.object({
    firstArg: Joi.string()
      .equal('first')
      .required(),
    secondArg: Joi.string()
      .equal('second')
      .required()
  })

  const middleware = args({ mapping: ['firstArg', 'secondArg'], schema })
  await middleware(context, Composer.safePassThru())

  t.deepEqual(context.state.args.raw, ['first', 'second'])
  t.deepEqual(context.state.args.result, { firstArg: 'first', secondArg: 'second' })
})

test('should remap and throw error when validation failed', async t => {
  const { context } = createContext({
    type: 'message'
  })

  const schema = Joi.object({
    firstArg: Joi.string()
      .equal('second')
      .required(),
    secondArg: Joi.string()
      .equal('first')
      .required()
  })

  await t.throwsAsync(async () => {
    const middleware = args({ mapping: ['firstArg', 'secondArg'], schema })
    await middleware(context, Composer.safePassThru())
  }, { instanceOf: ValidationError })
})

test('should call errorHandler when validate failed', async t => {
  t.plan(3)
  const { context } = createContext({
    type: 'message'
  })

  const schema = Joi.object({
    firstArg: Joi.string()
      .equal('second')
      .required(),
    secondArg: Joi.string()
      .equal('first')
      .required()
  })

  await t.notThrowsAsync(async () => {
    const middleware = args({
      mapping: ['firstArg', 'secondArg'],
      schema,
      errorHandler: (err, ctx) => {
        t.is(err instanceof ValidationError, true)
        t.deepEqual(ctx, context)
      }
    })
    await middleware(context, Composer.safePassThru())
  })
})
