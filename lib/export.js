/**
 * Created by Cooper on 2018/08/03.
 */
const fs = require('fs');
const _ = require('lodash');
const Item = require('../Item');
const iconv = require('iconv-lite');


function toCsv(){

}

Item.find({origin: '小米应用'})
  .then(ret => {
    console.log(ret.length);
    let data = '';
    ret.forEach(e => {
      e = e.toJSON();
      delete e._id;
      delete e.__v;
      // console.log(e, '==');
      data +=
        _.reduce(
          e,
          (s, v) => {
            return s + String(v).replace(/,/g, ' ') + ',';
          },
          '',
        ).slice(0, -1) + '\n';
    });
    // fs.writeFile('./export.csv', data, 'utf-8', function(err, data) {
    fs.writeFile('./小米应用.csv', iconv.encode(data, 'gbk'), null, function(err, d) {
      if (err) {
        console.log('========= err', err);
      }
      console.log('export done..');
    });
  })
  .catch(err => {
    console.error(err);
  });
