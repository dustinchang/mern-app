import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import TextField from 'material-ui/TextField';
import {red500} from 'material-ui/styles/colors'

export default class MaterialHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stocks: []
    };
  }

  componentDidMount() {
    fetch('/api/stocks')
      .then(res => res.json())
      .then(json => {
        this.setState({
          stocks: json
        });
      });
  }

  newStock = () => {
    fetch('/api/stocks', {method: 'POST'})
      .then(res => res.json())
      .then(json => {
        let stocks = this.state.stocks;
        stocks.push(json);
        this.setState({stocks});
      });
  };

  deleteStock = index => {
    const id = this.state.stocks[index]._id;
    fetch(`/api/stocks/${id}`, {method: 'DELETE'})
      .then(_ => {
        this._modifyStock(index, null);
      });
  };

  _modifyStock(index, data) {
    let stocks = this.state.stocks;
    data ? stocks[index] = data : stocks.splice(index, 1);
    this.setState({stocks});
  }

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

  //TODO set the grid areas for the stock tickers list
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title='Material Mern App' className='app-bar' showMenuIconButton={false}/>
          <div className='container'>
            <strong className='ticker'><u>Stock Tickers</u></strong>
            <strong className='price'><u>Stock Price</u></strong>

            <ul>
              { this.state.stocks.map((stock, i) => (
                <li key={i}>
                  <TextField
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

            <FloatingActionButton onClick={this.newStock} className='add-tickers'>
              <ContentAdd/>
            </FloatingActionButton>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
