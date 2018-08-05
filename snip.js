/**
 * Created by Cooper on 2018/8/5.
 */

exports.headers = function(source) {
  let j = {};
  source
    .trim()
    .split(/\n/)
    .forEach(header => {
      let [k, v] = header.split(': ');
      if (k.toLowerCase() !== 'content-length') {
        j[k] = v;
      }
    });
  return j;
};

/* test */
// let source = `  Accept: */*
// Accept-Encoding: gzip, deflate, br
// Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
// Connection: keep-alive
// Content-Length: 538
// Content-Type: application/x-www-form-urlencoded
// Host: blackhole.m.jd.com
// Origin: https://www.jd.com
// Referer: https://www.jd.com/
// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36   `;
// console.log(exports.headers(source));
