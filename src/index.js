const { Composer } = require('opengram')

// Default config
const joiConfig = {
  convert: true,
  allowUnknown: true,
  abortEarly: false
}

/**
 * @typedef {array<'message'|'channel_post'|'inline_query'>} allowedUpdates List of allowed updates
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
  const {
    mapping = [],
    schema,
    config,
    errorHandler,
    allowedUpdates = ['message', 'channel_post', 'inline_query']
  } = parameters

  /**
   * Middleware for parsing & validating command arguments
   * @param {OpengramContext} ctx Context object
   * @param {function} next
   */
  const middeware = (ctx, next) => {
    const { updateType, update } = ctx

    let remapped = {}
    let args = []

    if ((ctx.anyText && ctx.anyEntities?.[0]?.type === 'bot_command') || update[updateType].query !== undefined) {
      const text = update[updateType].text ?? update[updateType].query

      if (updateType === 'inline_query' && text) {
        args = text.split(' ')
      } else {
        const match = text.match(/^\/\S+\s?(.+)?/) ?? update[updateType].query

        if (match?.[1] !== undefined) {
          args = match[1].split(' ')
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
    }

    ctx.state.args = {
      raw: args,
      result: remapped
    }

    return next()
  }

  return Composer.mount(allowedUpdates, middeware)
}

module.exports = argumentsParserFactory
