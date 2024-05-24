import { useState, useRef, useEffect } from 'react';
import { ICurrency } from '../types';
import { currencies } from './Currencies';
import '../styles/convert.css';
import arrows from '../assets/arrows_white.png';

export default function ConvertSection() {
    const defaultFromCurrency = currencies.find(currency => currency.short_name === 'RUB')!;
    const defaultToCurrency = currencies.find(currency => currency.short_name === 'USD')!;

    const [isFrom, setIsFrom] = useState(false);
    const [isTo, setIsTo] = useState(false);
    const [amountFrom, setAmountFrom] = useState<string>('1');
    const [amountTo, setAmountTo] = useState<string>('');

    const [selectedFromCurrency, setSelectedFromCurrency] = useState<ICurrency>(defaultFromCurrency);
    const [selectedToCurrency, setSelectedToCurrency] = useState<ICurrency>(defaultToCurrency);

    const [searchFrom, setSearchFrom] = useState<string>('');
    const [searchTo, setSearchTo] = useState<string>('');

    const dropdownFromRef = useRef<HTMLDivElement>(null);
    const dropdownToRef = useRef<HTMLDivElement>(null);

    const formatAmount = (value: number) => {
        return parseFloat(value.toFixed(5));
    };

    const formatNumberWithSpaces = (value: any) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const handleFromCurrencySelect = (currency: ICurrency) => {
        setSelectedFromCurrency(currency);
        setIsFrom(false);
        if (selectedToCurrency) {
            setAmountTo(formatAmount((parseFloat(amountFrom) * currency.value) / selectedToCurrency.value).toString());
        }
    };

    const handleToCurrencySelect = (currency: ICurrency) => {
        setSelectedToCurrency(currency);
        setIsTo(false);
        if (selectedFromCurrency) {
            setAmountTo(formatAmount((parseFloat(amountFrom) * selectedFromCurrency.value) / currency.value).toString());
        }
    };

    const handleReverse = () => {
        const tempCurrency = selectedFromCurrency;
        setSelectedFromCurrency(selectedToCurrency);
        setSelectedToCurrency(tempCurrency);
        setAmountFrom(amountTo);
        setAmountTo(amountFrom);
    };

    const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, ''); // Удаляем пробелы
        if (/^\d*\.?\d*$/.test(value)) {
            const formattedValue = formatNumberWithSpaces(value);
            setAmountFrom(formattedValue);
            if (selectedFromCurrency && selectedToCurrency && value !== '') {
                setAmountTo(formatNumberWithSpaces(
                    formatAmount((parseFloat(value) * selectedFromCurrency.value) / selectedToCurrency.value).toString()
                ));
            } else {
                setAmountTo('');
            }
        }
    };
    
    const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, ''); // Удаляем пробелы
        if (/^\d*\.?\d*$/.test(value)) {
            const formattedValue = formatNumberWithSpaces(value);
            setAmountTo(formattedValue);
            if (selectedFromCurrency && selectedToCurrency && value !== '') {
                setAmountFrom(formatNumberWithSpaces(
                    formatAmount((parseFloat(value) * selectedToCurrency.value) / selectedFromCurrency.value).toString()
                ));
            } else {
                setAmountFrom('');
            }
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

    const filteredFromCurrencies = currencies.filter(currency =>
        currency.short_name.toLowerCase().includes(searchFrom.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchFrom.toLowerCase())
    );

    const filteredToCurrencies = currencies.filter(currency =>
        currency.short_name.toLowerCase().includes(searchTo.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchTo.toLowerCase())
    );

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
                <div className='inside_text'>
                    <h2>У меня есть</h2>
                    <img src={selectedFromCurrency.img} />
                </div>
                <div className='input_value_section'>
                <input 
                    type="text"
                    value={amountFrom}
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
                        <input 
                            placeholder='Rub...'
                            value={searchFrom}
                            onChange={(e) => setSearchFrom(e.target.value)}
                        />
                        {filteredFromCurrencies.map((currency) => (
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
                <div className='inside_text'>
                    <h2>Я хочу купить</h2>
                    <img src={selectedToCurrency.img} />
                </div>
                <div className='input_value_section'>
                <input 
                    type="text"
                    value={amountTo}
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
                        <input 
                            placeholder='Что вы ищете?'
                            value={searchTo}
                            onChange={(e) => setSearchTo(e.target.value)}
                        />
                        {filteredToCurrencies.map((currency) => (
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
