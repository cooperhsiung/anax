/**
 * Created by Cooper on 2018/8/4.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const xiaomiSchema = Schema({
  origin: {
    type: String,
    required: true,
    trim: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  subCate: {
    type: String,
    trim: true,
  },

  os: {
    type: String,
    trim: true,
  },

  times: {
    type: String,
    trim: true,
  },

  lastModified: {
    type: Date,
    required: true,
  },
});

// static store method, if not existed just use create;
xiaomiSchema.statics.store = function(data, cb) {
  this.findOne({ origin: data.origin, category: data.category, name: data.name }, (e1, r1) => {
    if (e1) {
      return cb(e1);
    }
    if (!r1) {
      this.create(data, cb);
    } else {
      this.updateOne({ origin: data.origin, category: data.category, name: data.name }, data, cb);
    }
  });
};

const Xiaomi = mongoose.model('Xiaomi', xiaomiSchema);

module.exports = [Xiaomi];
