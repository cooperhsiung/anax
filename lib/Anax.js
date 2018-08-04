/**
 * Created by Cooper on 2018/08/03.
 */
const path = require('path');
const mongoose = require('mongoose');
const querystring = require('querystring');
const { EventEmitter } = require('events');
const queue = require('./queue');
const request = require('./request');

class Anax extends EventEmitter {
  constructor() {
    super();
    this.mongoose = mongoose;
    this.flows = require(path.resolve(process.cwd(), 'flows.js'));
    this.scraps = require(path.resolve(process.cwd(), 'scraps.js'));
    this.models = require(path.resolve(process.cwd(), 'models.js'));
    this.modelNames = this.models.map(e => e.modelName);
    this.models.forEach(model => {
      this.on(model.modelName, data => {
        data = Array.isArray(data) ? data : [data];
        model.store = model.store || model.create;
        // data.forEach(e => {
        //   model.store(e, (err, doc) => {
        //     if (err) {
        //       console.log(err);
        //     }
        //   });
        // });
        // console.log(data);
      });
    });
  }

  startUI() {
    try {
      queue.app.listen(3000);
      console.log('listening on 3000..');
    } catch (e) {}
  }

  deliver(flowName, stuffs) {
    stuffs = Array.isArray(stuffs) ? stuffs : [stuffs];
    stuffs.forEach(stuff => queue.create(flowName, stuff).save(err => err && console.error(err)));
  }

  output(modelName, data) {
    if (this.modelNames.includes(modelName)) {
      this.emit(modelName, data);
    } else {
      throw new Error('model `' + modelName + '` is not registered');
    }
  }

  go() {
    this.startUI();
    this.flows.forEach(flow => {
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
    return parse({ $, body, res });
  }
}

module.exports = Anax;
