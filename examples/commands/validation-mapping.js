const { Opengram } = require('opengram')
const bot = new Opengram(process.env.BOT_TOKEN)

const Joi = require('joi')
const args = require('@opengram/arguments')

// Create middleware instance
const sumArgs = args({
  mapping: ['first', 'second'], // First argument to "first" property, second to "second" property
  errorHandler: (err, ctx) => ctx.reply(`Invalid arguments: ${err.message}`), // Error handler for validation errors
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

bot.command('sum', sumArgs, ctx => {
  // Destructuring assignment from safe, validated object, with converted to number args
  const { first, second } = ctx.state.args.result
  // Send sum result
  return ctx.replyWithHTML(`<b>Result:</b> ${first + second}`)
})

bot.launch()
  .then(() => console.log(`Bot ${bot.context.botInfo.username} started`))

// Enable graceful stop
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
