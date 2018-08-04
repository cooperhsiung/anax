/**
 * Created by Cooper on 2018/8/4.
 */
const sleep = require('../../lib/sleep');

let flow0 = {
  seed: true,
  name: 'getCateList',
  work: async function() {
    try {
      let list = await this.scrape('home');
      this.deliver('getItems', list);
    } catch (e) {
      console.error(e);
    }
  },
};

let flow1 = {
  name: 'getItems',
  concurrency: 1,
  work: async function(stuff, done) {
    try {
      let body = await this.scrape('getItems', { page: stuff.page, categoryId: stuff.categoryId });
      let l = [];
      body.data.forEach(e => {
        l.push({
          origin: '小米应用',
          name: e.displayName,
          category: stuff.category,
          lastModified: new Date(),
        });
      });
      if (body.data.length < 30) {
        done();
        this.output('Xiaomi', l);
      } else {
        await sleep();
        stuff.page++;
        done();
        this.deliver('getItems', stuff);
        this.output('Xiaomi', l);
      }
    } catch (e) {
      done(e);
    }
  },
};

module.exports = [flow0, flow1];
