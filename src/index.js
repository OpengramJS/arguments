// Default config
const joiConfig = {
  convert: true,
  allowUnknown: true,
  abortEarly: false
}

/**
 * @param {object} ctx Context object
 * @param {function} next
 * @returns {function}
 */

module.exports = function argumentsParserFactory (parameters = {}) {
  const { mapping = [], schema, config, errorHandler } = parameters

  return (ctx, next) => {
    if (
      ctx.updateType !== 'message' ||
      !ctx.updateSubTypes.includes('text') ||
      ctx.message.entities?.[0].type !== 'bot_command'
    ) {
      return next()
    }

    let remapped = {}
    let args = []
    let command

    const text = ctx.message.text
    const match = text.match(/^\/(\S+)\s?(.+)?/)

    if (match !== null) {
      const [, commandPart, argsPart] = match
      if (commandPart) {
        command = commandPart
      }

      if (argsPart) {
        args = argsPart.split(' ')
      }
    }

    if (mapping.length) {
      // Remap by mapping names
      for (let i = 0; i < mapping.length; i++) {
        remapped[
          mapping[i]
        ] = args[i]
      }
    }

    if (schema && mapping) {
      const { value, error } = schema.validate(remapped, { ...joiConfig, ...config })

      if (error) {
        if (errorHandler) {
          return Promise.resolve(
            errorHandler(error, ctx)
          )
        }

        throw error
      }

      remapped = value
    }

    ctx.state.command = {
      raw: text,
      name: command,
      rawArgs: args,
      args: remapped
    }

    return next()
  }
}
