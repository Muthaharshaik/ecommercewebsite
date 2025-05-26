// src/pages/Home.jsx
import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Banner />
      <FeaturedProducts />
      <Footer />
    </>
  );
};

export default Home;

