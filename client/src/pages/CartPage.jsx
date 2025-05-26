import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Cart.css';
import { useCart } from '../context/cartContext';
import { useUser } from '../context/userContext';  // <-- your user context hook

const Cart = () => {
  const { cartItems, increaseQty, decreaseQty, removeItem } = useCart();
  const { user } = useUser();  // get user from context
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">Shopping Cart ({cartItems.length})</h2>

      {!user ? (
        <div className="guest-message">
          <p>
            Only registered users can manage the cart and proceed to checkout.<br />
            Please login or register to continue.
          </p>
          <button onClick={handleGoHome} className="btn-go-home">Go to Home Page</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img className="item-image" src={item.product.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p className="item-number">Item #: {item.product._id}</p>
                  <p className="price">₹{item.product.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button
                      disabled={item.quantity <= 1}
                      className={item.quantity <= 1 ? 'disabled' : ''}
                      onClick={() => decreaseQty(item.product._id)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.product._id)}
                    >
                      +
                    </button>
                    <button onClick ={() => removeItem(item.product._id) }>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h3>ORDER SUMMARY</h3>
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="summary-line">
              <span>Tax:</span>
              <span>₹0.00</span>
            </div>
            <hr />
            <div className="summary-line total">
              <span>Total:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
