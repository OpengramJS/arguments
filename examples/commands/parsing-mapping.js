const { Opengram } = require('opengram')
const bot = new Opengram(process.env.BOT_TOKEN)

const args = require('@opengram/arguments')

// Register middleware
bot.use(args({
  mapping: ['first', 'second'] // First argument to "first" property, second to "second" property // Validation schema
}))

bot.command('test', ctx => {
  const { first, second } = ctx.state.args.result
  return ctx.reply(`Arguments: ${first} ${second}`)
})

bot.launch()
  .then(() => console.log(`Bot ${bot.context.botInfo.username} started`))

// Enable graceful stop
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())
