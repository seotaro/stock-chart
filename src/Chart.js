import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

// グラフ
// 横軸は UTC
export const Chart = ({ data }) => {
  const options = {
    title: {
      text: `${data.meta.symbol}`
    },
    rangeSelector: {
      enabled: false,
    },
    xAxis: {
      range: 3 * 24 * 3600 * 1000,
      labels: {},
    },
    plotOptions: {
      candlestick: {
        color: '#0099e5',
        upColor: '#f24478',
      }
    },
    series: [{
      type: 'candlestick',
      name: 'Stock Price',
      data: data.series,
      tooltip: { valueDecimals: 2 }
    }]
  }

  return (
    <Box sx={{ width: '50%' }} >
      <Card sx={{ m: 1 }} >
        <CardContent sx={{ pb: 0 }} >
          <HighchartsReact
            containerProps={{ style: { height: "100%" } }}
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={options}
          />
        </CardContent>
      </Card>
    </Box>
  )
}