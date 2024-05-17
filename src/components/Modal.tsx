import React, { useEffect, useState } from 'react';
import '../styles/modal.css';
import { ICurrency } from '../types';
import { currencies } from './Currencies';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredCurrencies, setFilteredCurrencies] = useState<ICurrency[]>(currencies);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (isOpen && !(event.target as HTMLElement).closest('.modal-content')) {
                onClose();
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (isOpen && event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        setFilteredCurrencies(
            currencies.filter(currency =>
                currency.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}></button>
                <div className='modal_search'>
                    <input 
                        type="text" 
                        placeholder="Поиск по имени валюты..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='all_modal_el'>
                    {filteredCurrencies.length > 0 ? (
                        filteredCurrencies.map((currency: ICurrency) => (
                            <div className='single_modal_el' key={currency.short_name}>
                                <div>
                                <img src={currency.img} alt='currency'/>
                                <h2>{currency.name}</h2>
                                </div>

                                <h3>{currency.value}</h3>
                            </div>
                        ))
                    ) : (
                        <h2>По вашим запросам ничего не найдено</h2>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modal;
