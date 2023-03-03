const { Opengram } = require('opengram')
const bot = new Opengram(process.env.BOT_TOKEN)

const args = require('@opengram/arguments')

// Register middleware
bot.use(args())

bot.command('test', ctx => {
  const argumentsList = ctx.state.args.raw.join(', ')
  return ctx.reply(`Arguments: ${argumentsList}`)
})

bot.launch()
  .then(() => console.log(`Bot ${bot.context.botInfo.username} started`))

// Enable graceful stop
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
