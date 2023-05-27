import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

// グラフ
export const Chart = ({ data }) => {
  const options = {
    title: {
      text: `${data.meta.symbol}`
    },
    rangeSelector: {
      enabled: false,
    },
    xAxis: {
      range: 2 * 24 * 3600 * 1000
    },
    plotOptions: {
      candlestick: {
        color: '#0099e5',
        upColor: '#f24478',
      }
    },
    series: [{
      type: 'candlestick',
      name: `${data.meta.symbol} Stock Price`,
      data: data.series,
      tooltip: { valueDecimals: 2 }
    }]
  }

  return (
    <HighchartsReact
      containerProps={{ style: { height: "100%" } }}
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={options}
    />
  )
}