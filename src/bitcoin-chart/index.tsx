import { MenuItem, Select, FormControl, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import ClipLoader from "react-spinners/ClipLoader";
import './bitcoin-chart.scss';

interface ICurrency {
    value:string;
    text:string;
    symbol:string
}

interface IBpiCurrency {
    code:string;
    rate:string;
    symbol:string;
}

interface IBpiDateRate {
    date: string;
    rate: number;
}

const getCurrencyPriceApiUrl = function(currency:string): string {
    return `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`;
}

const getHistoricalCloseApiUrl = function(currency:string): string {
    return `https://api.coindesk.com/v1/bpi/historical/close.json?currency=${currency}`;
}

const CURRENCIES : ICurrency[] = [
    {value: 'USD', text: 'USD', symbol:'$'},
    {value: 'EUR', text: 'EUR', symbol:'€'},
    {value: 'CNY', text: 'CNY', symbol:'¥'},
    {value: 'JPY', text: 'JPY', symbol:'¥'},
    {value: 'PLN', text: 'PLN', symbol:'zł'}
];

function BitcoinChart() {
    const [loading, setLoading] = useState(false);
    const [activeCurrency, setActiveCurrency] = useState<IBpiCurrency | undefined>(undefined);
    const [historicData, setHistoricData] = useState<IBpiDateRate[] | [] | undefined>(undefined);

    function handleCurrencyChange(event:SelectChangeEvent) {
        const currency = CURRENCIES.filter(el => el.value == event.target.value);
        fetchBitcoinData(currency[0].value, currency[0].symbol);
    }

    const fetchCurrencyPrice = async function(currency:string, symbol:string) : Promise<void> {
        const apiUrl = getCurrencyPriceApiUrl(currency);
        const jsonData = await (await fetch(apiUrl)).json();
        setActiveCurrency({code: jsonData.bpi[currency].code, rate: parseFloat(jsonData.bpi[currency].rate.replace(/,/g, '')).toFixed(2), symbol: symbol})
    }

    const fetchHistoricalClose = async function(currency:string) : Promise<void> {
        const apiUrl = getHistoricalCloseApiUrl(currency);
        const jsonData = await (await fetch(apiUrl)).json();
        
        setHistoricData(Object.keys(jsonData.bpi).map((key) => ({date: key, rate: jsonData.bpi[key]})));
    }


    const fetchBitcoinData = async function(currency:string, symbol:string) : Promise<void> {
        setLoading(true);

        Promise.all([fetchCurrencyPrice(currency, symbol), fetchHistoricalClose(currency)]).then(() => setLoading(false));
    }

    useEffect(() => {
        fetchBitcoinData(CURRENCIES[0].value, CURRENCIES[0].symbol);
    }, []);

  return (
    <div className='bitcoin-chart d-flex justify-content-center container flex-column p-3'>
        { !loading &&
            <div className='row'>
                <div className='col-12 d-flex justify-content-end'>
                    <div className='currency'>
                        <span className='currency__rate'>{activeCurrency?.symbol}{activeCurrency?.rate}</span>
                        <FormControl variant="standard">
                            <Select
                                onChange={handleCurrencyChange}
                                label="Choose Currency"
                                value={activeCurrency?.code}
                            >
                                { CURRENCIES.map((curr, index) => (
                                    <MenuItem key={index} value={curr.value}>{curr.text}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="col-12">
                    <ResponsiveContainer width="95%" height={400}>
                        <LineChart
                            data={historicData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="rate" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        }
        { loading &&
            <div className='d-flex justify-content-center align-items-center'>
                <ClipLoader size={50}/>
            </div>
        }
    </div>
  );
}

export default BitcoinChart;
