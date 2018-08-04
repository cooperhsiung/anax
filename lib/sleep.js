/**
 * Created by Cooper on 2018/08/03.
 */

function sleep() {
  return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
}

module.exports = sleep;
