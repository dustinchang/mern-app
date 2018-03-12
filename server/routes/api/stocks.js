const Stock = require('../../models/Stock');

module.exports = (app) => {
  app.get('/api/stocks', (req, res, next) => {
    Stock.find()
      .exec()
      .then(stock => res.json(stock))
      .catch(err => next(err));
  });

  app.post('/api/stocks', (req, res, next) => {
    const stock = new Stock();

    stock.save()
      .then(() => res.json(stock))
      .catch(err => next(err))
  });

  app.delete('/api/stocks/:id', (req, res, next) => {
    Stock.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then(stock => res.json())
      .catch(err => next(err));
  });

  app.put('/api/stocks/:id/modify', (req, res, next) => {
    Stock.findById(req.params.id)
      .exec()
      .then((stock) => {
        stock.stockName = req.body.newVal;
        stock.save()
          .then(() => res.json(stock))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
};
