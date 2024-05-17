import { useEffect, useRef, useState } from 'react';
import { ICurrency } from '../types';
import { currencies } from './Currencies';
import Header from './Header';
import ConvertSection from './ConvertSection';
import '../styles/mainbody.css';
import Modal from './Modal';
import github from '../assets/github2.gif';

export default function Mainbody() {
    const currencyContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currencyContainerRef.current) {
            const containerWidth = currencyContainerRef.current.offsetWidth;
            const itemsWidth = currencyContainerRef.current.scrollWidth;
            const cloneOffset = (containerWidth / 2) + (itemsWidth / currencies.length);
            currencyContainerRef.current.style.setProperty('--clone-offset', `-${cloneOffset}px`);
        }
    }, []);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className='mainbody'>
            <Header />
            <div className='mainbody_part'>
                <h2>Money Convertor</h2>
                <div className="currency-container">
                    {currencies.map((currency: ICurrency) => (
                        <div className="currency-item" key={currency.short_name}>
                            <h4>{currency.name}</h4>
                            <h3>{currency.value}</h3>
                            <img src={currency.img} />
                        </div>
                    ))}
                    {currencies.map((currency: ICurrency) => (
                        <div className="currency-item" key={currency.short_name + "_clone"}>
                            <h4>{currency.name}</h4>
                            <h3>{currency.value}</h3>
                            <img src={currency.img} />
                        </div>
                    ))}
                </div>
                <ConvertSection />
            </div>

            <div className='center'>
                <button onClick={openModal}>Открыть список всех монет</button>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
            <a href='https://github.com/thainlao/converter' className='github'>
                <img src={github} alt='github'/>
                <h2>Open code</h2>
            </a>
        </div>
    )
}
