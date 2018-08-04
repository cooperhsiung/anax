/**
 * Created by Cooper on 2018/8/4.
 */
const kue = require('kue');
const queue = kue.createQueue();
queue.watchStuckJobs();

module.exports = queue;
module.exports.app = kue.app;
