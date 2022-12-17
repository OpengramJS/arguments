const { Context, Telegram } = require('opengram')

function createContext ({
  text = '/start first second',
  type,
  entities = true,
  start = 0,
  end = 6
}) {
  const data = {}

  if (type === 'inline_query') {
    data.query = text
  } else {
    if (entities) {
      Object.assign(data, {
        entities: [{
          offset: start,
          length: end,
          type: 'bot_command'
        }]
      })
    }
    data.text = text
  }

  const context = new Context({
    [type]: {
      ...data
    }
  }, new Telegram('TOKEN', {}), { channelMode: false })

  return { context, command: text }
}

module.exports = {
  createContext
}
