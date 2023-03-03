const { Opengram } = require('opengram')
const bot = new Opengram(process.env.BOT_TOKEN)

const args = require('@opengram/arguments')

// Register middleware
bot.use(args({
  mapping: ['first', 'second'] // First argument to "first" property, second to "second" property // Validation schema
}))

bot.on('inline_query', ctx => {
  const { first, second } = ctx.state.args.result

  // Send result
  return ctx.answerInlineQuery([{
    type: 'article',
    id: 'result',
    title: `Args: ${first} ${second}`,
    cache_time: 1,
    input_message_content: {
      message_text: `Arguments: ${first} ${second}`
    }
  }])
})

bot.launch()
  .then(() => console.log(`Bot ${bot.context.botInfo.username} started`))

// Enable graceful stop
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
