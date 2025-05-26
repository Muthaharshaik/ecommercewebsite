// src/components/FeaturedProducts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.slice(0, 5)); // Show only first 10 for simplicity
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="featured-container">
      <h2 className="featured-title">Our Best Collection</h2>
      <div className="scroll-container">
        <div className="scroll-row">
          {[...products, ...products].map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;

