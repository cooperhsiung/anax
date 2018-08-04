/**
 * Created by Cooper on 2018/8/4.
 */
const kue = require('kue');
const queue = kue.createQueue({ redis: process.env.REDIS || 'redis://127.0.0.1:6379/0' });
queue.watchStuckJobs();

module.exports = queue;
module.exports.app = kue.app;
