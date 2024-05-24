import btc from '../assets/btc.png';
import { ICurrency } from '../types';
import eth from '../assets/eth.png';
import rub from '../assets/russ.png';
import eu from '../assets/eu.png';
import dollar from '../assets/usa.jpg';
import china from '../assets/china.png';
import sol from '../assets/sol.png';
import ton from '../assets/ton.png';
import not from '../assets/NOT.png';
import xrp from '../assets/xrp.svg';
import doge from '../assets/doge.png';

export const currencies: ICurrency[] = [
    {
        "name": "Bitcoin",
        "short_name": "BTC",
        "img": btc,
        "value": 67566
    },
    {
        "name": "US Dollar",
        "short_name": "USD",
        "img": dollar,
        "value": 1.00
    },
    {
        "name": "Ethereum",
        "short_name": "ETH",
        "img": eth,
        "value": 3705.82
    },
    {
        "name": "Euro",
        "short_name": "EUR",
        "img": eu,
        "value": 1.07
    },
    {
        "name": "Russian Ruble",
        "short_name": "RUB",
        "img": rub,
        "value": 0.011
    },
    {
        "name": "Yuan",
        "short_name": "CNY",
        "img": china,
        "value": 0.138
    },
    {
        "name": "TON Coin",
        "short_name": "TON",
        "img": ton,
        "value": 6.62
    },
    {
        "name": "Solana",
        "short_name": "SOL",
        "img": sol,
        "value": 167.2
    },
    {
        "name": "NOT Coin",
        "short_name": "NOT",
        "img": not,
        "value": 0.0047
    },
    {
        "name": "XRP",
        "short_name": "XRP",
        "img": xrp,
        "value": 0.52
    },
    {
        "name": "DOGE",
        "short_name": "DOGE",
        "img": doge,
        "value": 0.152
    }
];