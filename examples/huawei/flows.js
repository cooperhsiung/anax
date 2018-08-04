/**
 * Created by Cooper on 2018/8/4.
 */
const sleep = require('../../lib/sleep');

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
      stuff.pageNum = stuff.pageNum || 1;
      let itemList = await this.scrape('getItems', stuff);
      if (itemList.length < 24) {
        done();
      } else {
        await sleep();
        stuff.pageNum++;
        this.deliver('getItems', stuff);
        done();
      }
      this.output('Huawei', itemList);
    } catch (e) {
      done(e);
    }
  },
};

module.exports = [flow0, flow1];
