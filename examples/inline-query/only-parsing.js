const { Opengram } = require('opengram')
const bot = new Opengram(process.env.BOT_TOKEN)

const args = require('@opengram/arguments')

// Register middleware
bot.use(args())

bot.on('inline_query', ctx => {
  const argsList = ctx.state.args.raw.join(', ')

  // Send result
  return ctx.answerInlineQuery([{
    type: 'article',
    id: 'result',
    title: `Args: ${argsList}`,
    cache_time: 1,
    input_message_content: {
      message_text: `Arguments: ${argsList}`
    }
  }])
})

bot.launch()
  .then(() => console.log(`Bot ${bot.context.botInfo.username} started`))

// Enable graceful stop
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
