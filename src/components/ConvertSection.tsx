import { useState, useRef, useEffect } from 'react';
import { ICurrency } from '../types';
import { currencies } from './Currencies';
import '../styles/convert.css';
import arrows from '../assets/arrows_white.png';

export default function ConvertSection() {
    const [isFrom, setIsFrom] = useState(false);
    const [isTo, setIsTo] = useState(false);
    const [amountFrom, setAmountFrom] = useState<number>(1);
    const [amountTo, setAmountTo] = useState<number>(0);

    const [selectedFromCurrency, setSelectedFromCurrency] = useState<ICurrency | null>(null);
    const [selectedToCurrency, setSelectedToCurrency] = useState<ICurrency | null>(null);

    const dropdownFromRef = useRef<HTMLDivElement>(null);
    const dropdownToRef = useRef<HTMLDivElement>(null);

    const formatAmount = (value: number) => {
        return parseFloat(value.toFixed(5));
    };

    const handleFromCurrencySelect = (currency: ICurrency) => {
        setSelectedFromCurrency(currency);
        setIsFrom(false);
        if (selectedToCurrency) {
            setAmountTo(formatAmount((amountFrom * currency.value) / selectedToCurrency.value));
        }
    };

    const handleToCurrencySelect = (currency: ICurrency) => {
        setSelectedToCurrency(currency);
        setIsTo(false);
        if (selectedFromCurrency) {
            setAmountTo(formatAmount((amountFrom * selectedFromCurrency.value) / currency.value));
        }
    };

    const handleReverse = () => {
        const tempCurrency = selectedFromCurrency;
        setSelectedFromCurrency(selectedToCurrency);
        setSelectedToCurrency(tempCurrency);
        setAmountFrom(parseFloat(amountTo.toString()));
        setAmountTo(parseFloat(amountFrom.toFixed(5)));
    };

    const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setAmountFrom(value);
        if (selectedFromCurrency && selectedToCurrency) {
            setAmountTo(formatAmount((value * selectedFromCurrency.value) / selectedToCurrency.value));
        }
    };

    const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setAmountTo(value);
        if (selectedFromCurrency && selectedToCurrency) {
            setAmountFrom(formatAmount((value * selectedToCurrency.value) / selectedFromCurrency.value));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownFromRef.current && !dropdownFromRef.current.contains(event.target as Node)) {
                setIsFrom(false);
            }
            if (dropdownToRef.current && !dropdownToRef.current.contains(event.target as Node)) {
                setIsTo(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedFromCurrency && selectedToCurrency) {
            document.title = `Converter (${selectedFromCurrency.short_name} - ${selectedToCurrency.short_name})`;
        } else {
            document.title = 'Converter';
        }
    }, [selectedFromCurrency, selectedToCurrency]);

    return (
        <div className='input_section'>
            <section>
                <h2>У меня есть</h2>
                <div className='input_value_section'>
                    <input 
                        type="number"
                        value={formatAmount(amountFrom)}
                        onChange={handleAmountFromChange}
                        placeholder={`1 ${selectedFromCurrency?.short_name} = ${selectedFromCurrency && selectedToCurrency ? (selectedFromCurrency.value / selectedToCurrency.value).toFixed(5) : ''} ${selectedToCurrency?.short_name}`}
                    />
                    <span>{selectedFromCurrency?.short_name}</span>
                </div>
                <div onClick={() => setIsFrom((prev) => !prev)} className='button_open'>
                    <button>
                        {selectedFromCurrency ? `${selectedFromCurrency.name} (${selectedFromCurrency.value})` : 'Select Currency'}
                    </button>
                    <span style={{cursor: 'pointer'}}>
                        {!isFrom ? <div className='arrow-down'></div> : <div className='arrow-up'></div>}
                    </span>    
                </div>

                {isFrom && (
                    <div className='dropdown-content' ref={dropdownFromRef}>
                        {currencies.map((currency) => (
                            <div
                                className="dropdown-content_single"
                                key={currency.short_name}
                                onClick={() => handleFromCurrencySelect(currency)}
                            >
                                <img src={currency.img}/>
                                <p>{currency.short_name}({currency.value})</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <button onClick={handleReverse} className='reverse'>
                <img className='reverse_img' src={arrows} alt='arrows'/>
            </button>

            <section>
                <h2>Я хочу купить</h2>
                <div className='input_value_section'>
                    <input 
                        type="number"
                        value={formatAmount(amountTo)}
                        onChange={handleAmountToChange}
                        placeholder={`1 ${selectedToCurrency?.short_name} = ${selectedToCurrency && selectedFromCurrency ? (selectedToCurrency.value / selectedFromCurrency.value).toFixed(5) : ''} ${selectedFromCurrency?.short_name}`}
                    />
                    <span>{selectedToCurrency?.short_name}</span> 
                    
                </div>
                <div onClick={() => setIsTo((prev) => !prev)} className='button_open'>
                    <button>
                        {selectedToCurrency 
                        ? `${selectedToCurrency.name} (${selectedToCurrency.value})`
                        : 'Select Currency'}
                    </button>
                    <span style={{cursor: 'pointer'}}>
                        {!isTo ? <div className='arrow-down'></div> : <div className='arrow-up'></div>}
                    </span>  
                </div>
                {isTo && (
                    <div className='dropdown-content' ref={dropdownToRef}>
                        {currencies.map((currency) => (
                            <div
                                className="dropdown-content_single"
                                key={currency.short_name}
                                onClick={() => handleToCurrencySelect(currency)}
                            >
                                <img src={currency.img}/>
                                <p>{currency.short_name}({currency.value})</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
