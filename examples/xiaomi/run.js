/**
 * Created by Cooper on 2018/8/4.
 */
/* xiaomi app store list */
let Anax = require('../../lib/Anax');
let anax = new Anax();
// anax.go();
// anax.startUI();

const {toCsv} = require('../../lib/export');
const model = require('./models')[0];


toCsv(model,{origin:'小米应用'},{encoding:'gbk'})