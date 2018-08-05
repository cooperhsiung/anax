/**
 * Created by Cooper on 2018/08/03.
 */
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const querystring = require('querystring');
const { EventEmitter } = require('events');
const queue = require('./queue');
const request = require('./request');

mongoose.connect(
  process.env.MONGO || 'mongodb://127.0.0.1:27017/anax',
  { useNewUrlParser: true },
);

function toArray(any) {
  return Array.isArray(any) ? any : [any];
}

class Anax extends EventEmitter {
  constructor() {
    super();
    this.flows = require(path.resolve(process.cwd(), 'flows.js'));
    this.scraps = require(path.resolve(process.cwd(), 'scraps.js'));
    this.models = require(path.resolve(process.cwd(), 'models.js'));
    this.models = toArray(this.models);
  }

  startUI() {
    try {
      queue.app.listen(process.env.PORT || 3000);
      console.log('listening on 3000..');
    } catch (e) {
      /* only launch once */
    }
  }

  deliver(flowName, stuffs) {
    toArray(stuffs).forEach(stuff => queue.create(flowName, stuff).save(err => err && console.error(err)));
  }

  output(modelName, data) {
    if (this.models.map(e => e.modelName).includes(modelName)) {
      this.emit(modelName, data);
    } else {
      throw new Error('model `' + modelName + '` does not exist');
    }
  }

  go() {
    this.startUI();

    this.models.forEach(model => {
      this.on(model.modelName, data => {
        model.store = model.store || model.create;
        toArray(data).forEach(e => {
          model.store(e, (err, doc) => {
            if (err) {
              console.log(err);
            }
          });
        });
        // console.log(data);
      });
    });

    this.flows.forEach((flow, i) => {
      if (i === 0 && flow.seed !== true) {
        console.log('running without seed!!');
      }
      if (flow.seed === true) {
        flow.work.call(this);
      } else {
        queue.process(flow.name, flow.concurrency || 1, (job, done) => flow.work.call(this, job.data, done));
      }
    });
  }

  async scrape(scrap, params = {}) {
    let { build, parse } = this.scraps[scrap];
    if (typeof build !== 'function') {
      throw new TypeError('build should be function for scrap `' + scrap + '`');
    }
    if (typeof parse !== 'function') {
      throw new TypeError('parse should be function for scrap `' + scrap + '`');
    }
    let options = build(params);
    let startAt = Date.now();
    let { $, body, res } = await request(options);
    let info = {
      url: options.url + (options.qs ? '?' + querystring.stringify(options.qs) : ''),
      code: res.statusCode,
      size: res.contentLength,
      cost: Date.now() - startAt,
    };
    if (res.statusCode !== 200) {
      console.warn('%s %s %sB %sms', info.url, info.code, info.size, info.cost);
    } else {
      console.log('%s %s %sB %sms', info.url, info.code, info.size, info.cost);
    }
    return parse(Object.assign({ $, body, res }, params));
  }
}

module.exports = Anax;
