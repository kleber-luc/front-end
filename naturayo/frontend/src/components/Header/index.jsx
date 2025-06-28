import styles from './Header.module.css';
import { FaFacebookF, FaInstagram, FaUser, FaShoppingCart } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ModalConta from "../Modal/ModalConta";
import axios from 'axios';

function Header() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async () => {
        try {
            const response = await axios.get('/api/cart', { withCredentials: true });
            const count = response.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
            setCartCount(count);
        } catch (err) {
            setCartCount(0);
        }
    };

    useEffect(() => {
        fetchCartCount();
        window.addEventListener('cartUpdated', fetchCartCount);
        return () => window.removeEventListener('cartUpdated', fetchCartCount);
    }, []);

    return (
        <header className={styles.header}>
            {/* Barra Superior - Mantido original */}
            <div className={styles.barraSuperior}>
                <div className={styles.leftLinks}>
                    <a href="https://naturayo.com.br/" target='_blank'>Blog Naturayo</a>
                    <a href="#">Meus Favoritos</a>
                </div>
                <div className={styles.icons}>
                    <span><FiPhone size={14} /> (00)0-00000000</span>
                    <a href="https://www.facebook.com/naturAYO/?locale=pt_BR" target="_blank"><FaFacebookF size={14} /></a>
                    <a href="https://www.instagram.com/naturayo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank"><FaInstagram size={14} /></a>
                </div>
            </div>

            {/* Barra Central - Ajuste sutil */}
            <div className={styles.barraCentral}>
                <img src="/logo.png" alt="Logo Naturayo" className={styles.logo} />
                <input type="text" placeholder="O que deseja procurar?" className={styles.searchInput} />
                
                <div className={styles.accountCart}>
                    <span onClick={() => setMostrarModal(true)} style={{ cursor: 'pointer' }}>
                        <FaUser size={16} /> MINHA CONTA
                    </span>
                    <Link to="/carrinho" className={styles.cartWrapper}>
                        <FaShoppingCart size={16} />
                        <span className={styles.cartNumber}>{cartCount}</span>
                    </Link>
                </div>
            </div>

            {/* Main nav - Mantido original */}
            <nav className={styles.mainNav}>
                <a href="/">HOME</a>
                <a href="#">SOBRE</a>
                <a href="/">PRODUTOS</a>
                <a href="#">EXPORTAÇÃO</a>
                <a href="#">VEILING</a>
                <a href="#">INSPIRAÇÕES</a>
                <a href="#">CONTATO</a>
            </nav>
            
            {mostrarModal && <ModalConta onClose={() => setMostrarModal(false)} />}
        </header>
    );
}

export default Header;