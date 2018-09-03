import React, { Component } from 'react';
import { LineChart, Label, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class Chart extends Component{
    constructor(props){
        super(props);
        this.state = {
            livePrices: [],
        }
        this.getLivePrices = this.getLivePrices.bind(this);
    }

    getLivePrices(stockName){
        fetch(`https://api.iextrading.com/1.0/stock/${stockName}/quote`)
        .then(response => response.json())
        .then(responseData =>{
          var d = new Date();
          var hour = d.getHours();
          var mins = d.getMinutes();
          var secs = d.getSeconds();
          if(hour > 12) hour -= 12;
          else if(hour === 0) hour = 12;
          if(mins < 10) mins = '0' + mins;
          const time = hour + ':' + mins +':' + secs;
          console.log(time);
          const liveprices = this.state.livePrices.slice();
          const obj = {Price: responseData.iexRealtimePrice, time: time, PE: responseData.peRatio, SaleSize: responseData.iexRealtimeSize}
          liveprices.push(obj);
          this.setState({
            livePrices: liveprices
          })
        })
        .catch(error => {
          console.log('Error fetching and parsing data.', error);
        });
    }

    componentWillMount(){
        this.getLivePrices();
    }

    componentDidMount(){
        this.timer = setInterval(() => this.getLivePrices(this.props.symbol), 2000)
    }

    render() {
        return(
            <LineChart width={700} height={400} data={this.state.livePrices} margin={{ left: 30, bottom: 30 }}>
                <Line type="monotone" dataKey="Price" stroke="blue" />
                {/* <Line type="monotone" dataKey="SaleSize" stroke="green" /> */}
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="5 5"/>
                <XAxis dataKey="time" padding={{ left: 20 }}>
                    <Label value="Time" offset={0} position="bottom" />
                </XAxis>
                <YAxis type="number" domain={[dataMax => Math.floor(dataMax - 1), dataMax => Math.floor(dataMax + 1)]} padding={{ bottom: 20 }}>
                {/* <YAxis type="number" domain={[10, dataMax => (Math.floor(dataMax / 10) * 10 + 20)]} padding={{ bottom: 20 }}> */}
                    <Label angle="-90" value="Price + Sales" offset={-1} position="left" />
                </YAxis>
                <Tooltip />
            </LineChart>
        );
    }
}

export default Chart;