<header>
<img src="https://raw.githubusercontent.com/OpengramJS/opengram/master/docs/media/Logo.svg" alt="logo" height="90" align="left">
<h1 style="display: inline">Opengram arguments</h1>

The arguments plugin lets you parse & validate arguments of commands / inline query with ease.

[![CI][ci-image]][ci-url] [![codecov][codecov-image]][codecov-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url] [![Codacy Badge][codacy-image]][codacy-url] [![License: MIT][license-image]][license-url] [![FOSSA Status][fossa-image]][fossa-url]

</header>

## Features
-   [Joi](https://joi.dev/) validation support
-   Arguments remapping
-   Inline query / Message / Channel posts support

## Docs

You can find documentation [here](https://t.me/)

## Installation

### NPM
```bash
npm i @opengram/arguments
```

### Yarn
```bash
yarn add @opengram/arguments
```

### PNPM
```bash
pnpm add @opengram/arguments
```

## Quick start

```js
const { Opengram } = require('opengram')
const bot = new Opengram(process.env.BOT_TOKEN)

const Joi = require('joi')
const arguments = require('@opengram/arguments')
  
// Create middleware instance
const sumArgs = arguments({
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
```

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FOpengramJS%2Farguments.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FOpengramJS%2Farguments?ref=badge_large)

[codecov-image]: https://codecov.io/gh/OpengramJS/arguments/branch/master/graph/badge.svg?token=7SSVHV4Y6V
[codecov-url]: https://codecov.io/gh/OpengramJS/arguments
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT
[codacy-image]: https://app.codacy.com/project/badge/Grade/0ba3bf1b270946918b13e2730d190156
[codacy-url]: https://www.codacy.com/gh/OpengramJS/arguments/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=OpengramJS/opengram&amp;utm_campaign=Badge_Grade
[ci-image]: https://github.com/OpengramJS/arguments/actions/workflows/ci.yml/badge.svg?branch=master
[ci-url]: https://github.com/OpengramJS/arguments/actions/workflows/ci.yml
[npm-image]: https://img.shields.io/npm/v/@opengram/arguments.svg
[npm-url]: https://npmjs.com/package/@opengram/arguments
[downloads-image]: https://img.shields.io/npm/dm/@opengram/arguments.svg
[downloads-url]: https://npmjs.com/package/@opengram/arguments
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

[fossa-image]: https://app.fossa.com/api/projects/git%2Bgithub.com%2FOpengramJS%2Farguments.svg?type=shield
[fossa-url]: https://app.fossa.com/projects/git%2Bgithub.com%2FOpengramJS%2Farguments?ref=badge_shield
