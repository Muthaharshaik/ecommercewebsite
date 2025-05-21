import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div className="video-banner">
      <video autoPlay loop muted className="banner-video">
        <source src="/ecommvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="banner-overlay">
        <h1>Welcome to MyShop</h1>
        <p>Shop the latest Watches, Wallets, and Bags</p>
      </div>
    </div>
  );
};

export default Banner;


