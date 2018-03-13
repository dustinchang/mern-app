const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  stockName: {type: String, default: ''},
  stockQuote: {type: String, default: 'No quote available.'} //Still debating on if need this in db
});

module.exports = mongoose.model('Stock', StockSchema);
