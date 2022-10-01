// Default config
const joiConfig = {
  convert: true,
  allowUnknown: true,
  abortEarly: false
}

/**
 * @typedef {array<'message'|'channel_post'>} allowedUpdates List of allowed updates
 */

/**
 *
 * @typedef {object} initParams Init parameters
 * @property {array} [mapping] Allows you remap argument index to object property name
 * @property {object} [schema] Joi validation schema
 * @property {object} [config] Joi configuration object
 * @property {function} [errorHandler] Error handler for catching Joi validation errors
 * @property {allowedUpdates} [allowedUpdates] List of allowed updates
 */

/**
 * Middleware factory function
 * @param {initParams} [parameters]
 * @return {function}
 */
function argumentsParserFactory (parameters = {}) {
  const { mapping = [], schema, config, errorHandler, allowedUpdates = ['message', 'channel_post'] } = parameters

  /**
   * Middleware for parsing & validating command arguments
   * @param {object} ctx Context object
   * @param {function} next
   * @returns {function}
   */
  return (ctx, next) => {
    const { updateType } = ctx
    if (
      !(allowedUpdates.includes(updateType)) ||
      !ctx.updateSubTypes.includes('text') ||
      ctx[updateType].entities?.[0].type !== 'bot_command'
    ) {
      return next()
    }

    let remapped = {}
    let args = []
    let command

    const text = ctx[updateType].text
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

module.exports = argumentsParserFactory
