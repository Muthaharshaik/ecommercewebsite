import React from 'react';
import './ProductCard.css';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({product}) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const handleBuyNow = () => {
        if(user) {
            navigate(`/products/${product._id}`);
        } else {
            toast.error("Please login/signup to buy products")
        }
    }
    return (
        <div className='product-card'>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button className="buy-now-btn" onClick={handleBuyNow}>
               Buy Now
            </button>
        </div>
    )
}

export default ProductCard