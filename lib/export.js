/**
 * Created by Cooper on 2018/08/03.
 */
const fs = require('fs');
const _ = require('lodash');
const iconv = require('iconv-lite');

function toCsv(model, query = {}, options = {}) {
  if (typeof model.find !== 'function' || !model.modelName) {
    throw new Error('model should be type of mongoose.Model');
  }
  let fileName = (options.fileName || model.modelName) + '.csv';
  let encoding = options.encoding || 'utf-8';
  model
    .find(query)
    .then(ret => {
      console.log(ret.length + ' records were found');
      let data = '';
      ret.forEach((e, i) => {
        e = e.toJSON();
        delete e._id;
        delete e.__v;
        if (i === 0) {
          data +=
            _.reduce(
              e,
              (s, v, k) => {
                return s + String(k).replace(/,/g, ' ') + ',';
              },
              '',
            ).slice(0, -1) + '\n';
        }
        data +=
          _.reduce(
            e,
            (s, v) => {
              return s + String(v).replace(/,/g, ' ') + ',';
            },
            '',
          ).slice(0, -1) + '\n';
      });
      fs.writeFile(fileName, iconv.encode(data, encoding), null, function(err) {
        if (err) {
          console.error(err);
        }
        console.log('export done..');
      });
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = { toCsv };
