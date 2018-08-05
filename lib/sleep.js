/**
 * Created by Cooper on 2018/08/03.
 */

function sleep(delay = 0) {
  if (delay < -500) {
    throw new Error('sleep time should be positive');
  } else {
    return new Promise(resolve => setTimeout(resolve, delay + 500 + Math.random() * 500));
  }
}

module.exports = sleep;
