/**
 * Created by Cooper on 2018/08/03.
 */
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const request = require('request').defaults({ gzip: true, json: true, timeout: 15000 });

module.exports = function(options) {
  return new Promise(function(resolve, reject) {
    setTimeout(reject, 15000, new Error('timeout'));
    const encoding = options.encoding || 'utf-8';
    options.encoding = null;
    request(options, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        if (Buffer.isBuffer(res.body)) {
          res.body = iconv.decode(res.body, encoding);
          let $ = cheerio.load(res.body);
          res.contentLength = Buffer.byteLength(res.body);
          return resolve({ $, body: res.body, res });
        } else if (body) {
          res.contentLength = Buffer.byteLength(JSON.stringify(body));
          return resolve({ body, res });
        } else {
          res.contentLength = 0;
          return resolve({ body, res });
        }
      }
    });
  });
};
