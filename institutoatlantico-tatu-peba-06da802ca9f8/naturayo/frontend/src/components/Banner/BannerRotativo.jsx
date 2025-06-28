import React, { useState, useEffect } from 'react';
import styles from './BannerRotativo.module.css';

const BannerRotativo = () => {
  const images = [
    '/src/assets/img/Banner/banner1.jpg',
    '/src/assets/img/Banner/banner2.jpg',
    '/src/assets/img/Banner/banner3.jpg',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 
    return () => clearInterval(intervalId); 
  }, [images.length]);

  return (
    <div className={styles.bannerContainer}>
      <img
        src={images[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        className={styles.bannerImage}
      />
    </div>
  );
};

export default BannerRotativo;