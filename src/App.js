import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import twelvedata from "twelvedata";

import { Chart } from './Chart';

const client = twelvedata({ key: process.env.REACT_APP_TWELVEDATA_API_KEY });
const API_INTERVAL = process.env.REACT_APP_TWELVEDATA_API_INTERVAL || 60000;

console.log('API interval', API_INTERVAL / 1000, '[sec]');

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);

  const query = useQuery();
  const symbols = (query.get('symbols') || 'USD/JPY').split(',');
  const slideshowInterval = query.get('slideshowInterval') || 10000;

  const updateLastUpdated = () => {
    setLastUpdated(new Date());
  }

  const load = () => {
    const params = {
      symbols,
      intervals: ['5min'],
      outputsize: 200,
      methods: ['time_series'],
    };

    client
      .complexData(params)
      .then((result) => {
        if (result.status === 'ok') {
          result.data.forEach(data => {
            data.values.forEach(x => {
              x.datetime = (new Date(x.datetime)).getTime();
            })
            data.values.sort(function (a, b) {
              return a.datetime - b.datetime;
            });

            data.series = [];
            data.values.forEach(x => {
              const value = [
                x.datetime,
                Number(x.open),
                Number(x.high),
                Number(x.low),
                Number(x.close),
              ];
              data.series.push(value);
            })
          })

          setData(result.data);
          updateLastUpdated();
          console.log('load', (new Date()).toLocaleString());
        } else {
          console.log('load', (new Date()).toLocaleString(), result);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useInterval(() => {
    if (data) {
      setCurrent((current + 1) % data.length);
    }
  }, slideshowInterval);

  useEffect(() => {
    load();
  }, []);

  useInterval(() => {
    load();
  }, API_INTERVAL);

  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      {data && <Chart data={data[current]} />}
      <LastUpdated lastUpdated={lastUpdated} />
    </Box>
  )
}

export default App;

// 更新時刻
const LastUpdated = ({ lastUpdated }) => {
  return (
    <Box style={{ position: "absolute", top: 0, right: 10, }}>
      <Typography variant="subtitle1" sx={{ color: 'grey' }} >
        update: {moment(lastUpdated).format("YYYY-MM-DD HH:mm:ss")}
      </Typography>
    </Box>
  )
}

const useInterval = (callback, interval) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => { callbackRef.current() }
    const id = (0 < interval) ? setInterval(tick, interval) : null;

    return () => {
      if (id != null) {
        clearInterval(id);
      }
    };
  }, []);
};
