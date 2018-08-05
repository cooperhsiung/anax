/**
 * Created by Cooper on 2018/8/4.
 */
const sleep  = require('../../lib/sleep');

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
  concurrency: 2,
  work: async function(stuff, done) {
    try {
      let itemList = await this.scrape('getItems', stuff);
      if (itemList.length < 30) {
        done();
      } else {
        await sleep();
        stuff.pageNum++;
        done();
        this.deliver('getItems', stuff);
      }
      this.output('Xiaomi', itemList);
    } catch (e) {
      done(e);
    }
  },
};

module.exports = [flow0, flow1];
