const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductScema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  GST: { type: String, required: true },
});

module.exports = mongoose.model('Product', ProductScema);
