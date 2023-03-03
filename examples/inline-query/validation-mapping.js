const { Opengram } = require('opengram')
const bot = new Opengram(process.env.BOT_TOKEN)

const Joi = require('joi')
const args = require('@opengram/arguments')

// Create middleware instance
const sumArgs = args({
  mapping: ['first', 'second'], // First argument to "first" property, second to "second" property
  errorHandler: (err, ctx) => ctx.answerInlineQuery([{ // Error handler for validation errors
    type: 'article',
    id: 'result',
    title: `Invalid arguments: ${err.message}`,
    cache_time: 1,
    input_message_content: {
      message_text: `Invalid arguments: ${err.message}`
    }
  }]),
  // Validation schema
  schema: Joi.object({
    first: Joi
      .number()
      .integer()
      .required(),
    second: Joi
      .number()
      .integer()
      .required()
  })
})

bot.on('inline_query', sumArgs, ctx => {
  // Destructuring assignment from safe, validated object, with converted to number args
  const { first, second } = ctx.state.args.result

  // Send sum result
  return ctx.answerInlineQuery([{
    type: 'article',
    id: 'result',
    title: `Result: ${first + second}`,
    cache_time: 1,
    input_message_content: {
      message_text: `Result: ${first + second}`
    }
  }])
})

bot.launch()
  .then(() => console.log(`Bot ${bot.context.botInfo.username} started`))

// Enable graceful stop
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
