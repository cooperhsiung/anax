# Anax

[![NPM Version][npm-image]][npm-url]

an empirical spider framework, provides convenience for extracting data from specific websites.

# Examples

looking for usage and examples

https://github.com/cooperhsiung/anax-examples

# Installation

```bash
npm i anax -S
```

# Dependencies

## database

- redis
- mongodb

## library

- kue, message queue
- request, http client
- cheerio, html parser
- mongoose, ORM

# Concepts

## models

constructors compiled from your target data's Schema definitions

```javascript
const Schema = require('mongoose').Schema;
const itemSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
  },

  lastModified: {
    type: Date,
    required: true,
  },
});

const Product = mongoose.model('Product', itemSchema);

module.exports = [Product];
```

## flows

workflow, connected by message queue step by step

```javascript
let flow0 = {
  seed: true,
  name: 'getCateList',
  work: async function() {
    try {
      let cateList = await this.scrape('home');
      this.deliver('getItems', cateList);
    } catch (e) {
      console.error(e);
    }
  },
};

let flow1 = {
  name: 'getItems',
  work: async function(stuff, done) {
    try {
      let itemList = await this.scrape('getItems', stuff);
      this.output('Product', itemList);
    } catch (e) {
      done(e);
    }
  },
};

module.exports = [flow0, flow1];
```

## scraps

build request and parse response

```javascript
module.exports = {
  home: {
    build: params => ({
      /* request options*/
    }),
    parse: ({ $, ...params }) => {
      let l = [];
      $('select li').each((i, e) => {
        l.push({
          /* parse */
        });
      });
      return l;
    },
  },

  getItems: {
    build: params => ({
      /* request options*/
    }),
    parse: ({ $, ...params }) => {
      let l = [];
      $('select li').each((i, e) => {
        l.push({
          /* parse */
        });
      });
      return l;
    },
  },
};
```

## env config

use .env for eg:

```bash
MONGO=mongodb://127.0.0.1:27017/anax
REDIS=redis://127.0.0.1:6379/0
PORT=3000
```

[npm-image]: https://img.shields.io/npm/v/anax.svg
[npm-url]: https://www.npmjs.com/package/anax
