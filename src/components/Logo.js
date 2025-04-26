import React from 'react';
import logoDesktop from '../assets/logos/logo-desktop.svg';
import logoTablet from '../assets/logos/logo-tablet.svg';
import logoMobile from '../assets/logos/logo-mobile.svg';
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={logoDesktop} alt="Логотип" className="logo logo-desktop" />
      <img src={logoTablet} alt="Логотип" className="logo logo-tablet" />
      <img src={logoMobile} alt="Логотип" className="logo logo-mobile" />
    </div>
  );
};

export default Logo;