const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  stockName: {type: String, default: ''}
});

module.exports = mongoose.model('Stock', StockSchema);
