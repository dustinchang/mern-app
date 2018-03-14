import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import TextField from 'material-ui/TextField';
import {red500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton';

export default class MaterialHome extends Component {
  constructor(props) {
    super(props);
    this.state = {stocks: []};
  }

  //Fetch the stocks from db
  componentDidMount() {
    fetch('/api/stocks')
      .then(res => res.json())
      .then(json => {
        this.setState({
          stocks: json
        });
        this.quoteRefresh();
      });
  }

  //Creates a blank new stock placement
  newStock = () => {
    fetch('/api/stocks', {method: 'POST'})
      .then(res => res.json())
      .then(json => {
        let stocks = this.state.stocks;
        stocks.push(json);
        this.setState({stocks});
      });
  };

  //Deletes a stock from db
  deleteStock = index => {
    const id = this.state.stocks[index]._id;
    fetch(`/api/stocks/${id}`, {method: 'DELETE'})
      .then(_ => {
        this._modifyStock(index, null);
      });
  };

  //Modify an existing stock
  _modifyStock(index, data) {
    let stocks = this.state.stocks;
    data ? stocks[index] = data : stocks.splice(index, 1);
    this.setState({stocks});
  }

  //Handle changes in text and updates db
  handleChange = (index, event, newVal) => {
    const id = this.state.stocks[index]._id;

    fetch(`/api/stocks/${id}/modify`, {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({newVal})
    })
      .then(res => res.json())
      .then(json => this._modifyStock(index, json));
  };

  //On refresh button click refresh the stock quotes
  onClickRefresh = (event) => {
    this.setStockQuotes(event);
  };

  //Sets the stock quotes
  setStockQuotes = (event) => {
    const symbols = this.state.stocks.map(stock => stock.stockName).toString();
    const alpha_key = 'NNOSUQMKR1PZQCEK';
    const url = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${symbols}&apikey=${alpha_key}`;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        let stocks = this.state.stocks;
        json['Stock Quotes'].forEach(stock => {
          const currStock = stocks.find(stk => stk.stockName.toUpperCase() === stock['1. symbol']);
          if(currStock) {
            currStock.stockQuote = stock['2. price'];
          }
        });
        this.setState({stocks});
      });
  };

  //Polling function to update stock quotes every 10 seconds
  quoteRefresh = () => {
    this.setStockQuotes();
    setTimeout(this.quoteRefresh, 10000);
  };

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title='Material Mern Stock App' className='app-bar' showMenuIconButton={false}/>
          <div className='container'>
            <strong className='ticker'><u>Stock Tickers</u></strong>
            <div className='price'>
            <strong><u>Stock Price</u></strong>
              <FlatButton onClick={this.onClickRefresh} label="Refresh" primary={true}/>
            </div>

            <ul className='tickers'>
              { this.state.stocks.map((stock, i) => (
                <li key={i}>
                  <TextField
                    className='ticker-item'
                    hintText="Input a stock ticker"
                    value={stock.stockName}
                    onChange={this.handleChange.bind(this, i)}
                  />
                  <FloatingActionButton onClick={() => this.deleteStock(i)} mini={true} backgroundColor={red500}>
                    <ContentClear/>
                  </FloatingActionButton>
                </li>
              ))}
            </ul>

            <ul className='prices'>
              { this.state.stocks.map((stock, i) => (
                <li key={i}>
                  <TextField
                    id={`${i}`}
                    disabled={true}
                    value={stock.stockQuote}
                  />
                </li>
              ))}
            </ul>

            <FloatingActionButton onClick={this.newStock} className='add-tickers'>
              <ContentAdd/>
            </FloatingActionButton>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
