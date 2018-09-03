import React, { Component } from 'react';
import { InputGroup, Input, Container, Button, InputGroupAddon, ListGroup, ListGroupItem, Navbar } from 'reactstrap'
import './App.css';
import Chart from './Chart';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      symbol: '',
      comapanyName: '',
      price: '',
      low: '',
      high: '',
      toggle: false
    }
    this.grabSymbol = this.grabSymbol.bind(this);
    this.getCompanyInfo = this.getCompanyInfo.bind(this);
    this.toggleGraph = this.toggleGraph.bind(this);
  }
  grabSymbol(e){
    this.setState({
      symbol: e.target.value
    }, () => {
      this.getCompanyInfo();
    })
  }

  liveUpdates(){
    this.timer = setInterval(() => this.getCompanyInfo(), 2000)
  }

  toggleGraph(){
    this.setState({
      toggle: true
    }, this.showGraph(), this.liveUpdates())
  }

  showGraph(){
    if(this.state.toggle){
      return <Chart symbol={this.state.symbol} />
    }
    return null;
  }

  getCompanyInfo(stockName){
    fetch(`https://api.iextrading.com/1.0/stock/${this.state.symbol}/quote`)
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        this.setState({
          comapanyName: responseData.companyName,
          low: responseData.low,
          high: responseData.high,
          price: responseData.latestPrice,
        })
      })
      .catch(error => {
            console.log('Error fetching and parsing data.', error);
      });
  }

  render() {
    return (
      <div className="App">
        <Navbar style={{backgroundColor: '#5C5757'}}>
          <h3 className="mx-auto" style={{color: 'white'}}> Stocks </h3>
        </Navbar>
          <Container className="mt-4 w-25">
            <InputGroup>
              <Input onChange={this.grabSymbol}/>
              <InputGroupAddon addonType="append"><Button color="primary" onClick={this.toggleGraph}>Live Updates</Button></InputGroupAddon>
            </InputGroup>
            <ListGroup className="my-4">
              <ListGroupItem color="primary">company: {this.state.comapanyName}</ListGroupItem>
              <ListGroupItem color="warning">price: {this.state.price}</ListGroupItem>
              <ListGroupItem color="success">high: {this.state.high}</ListGroupItem>
              <ListGroupItem color="danger">low: {this.state.low}</ListGroupItem>
            </ListGroup>
          </Container>
          <div align="center">
            {this.showGraph()}
          </div>
      </div>
    );
  }
}

export default App;
