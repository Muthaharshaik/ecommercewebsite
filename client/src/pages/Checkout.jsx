import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import { useUser } from '../context/userContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CheckoutPage.css'

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

const [errors, setErrors] = useState({});
const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  //checking form errors
const validateForm = () => {
  const newErrors = {};
    Object.entries(shippingAddress).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key[0].toUpperCase() + key.slice(1)} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }
    const res = await loadRazorpay();
    if (!res) {
      console.log("Razorpay SDK failed to load");
      return;
    }

    if (!user) return toast.error('Please login to continue');

    try {
      const { data } = await axios.post('api/payment/create-order', {
        amount: subtotal * 100
      }, { withCredentials: true });
      console.log("Amount sent to backend:", subtotal*100);
      const options = {
        key: "rzp_test_oyFLAyyP9HhbS6",
        amount: subtotal * 100,
        currency: 'INR',
        name: `Muthahar's Mart`,
        description: 'Order Payment',
        order_id: data.orderId,
        prefill: {
          name: user.name,
          email: user.email
        },
        handler: async function (response) {
          try {
            const paymentData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };

            const verifyRes = await axios.post('/api/orders', {
              paymentInfo: paymentData,
              shippingAddress
            }, { withCredentials: true });
            console.log(verifyRes.data)
            toast.success('Payment successful and order placed!');
            clearCart();
            navigate('/order-confirmation', { state: { order: verifyRes.data } });
          } catch (error) {
            console.error(error);
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      toast.error('Failed to initiate payment');
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4">Checkout</h3>
      <div className="row g-4">
        {/* Shipping Address */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Shipping Address</h4>
            {['street', 'city', 'state', 'postalCode', 'country'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label text-capitalize">{field}</label>
                <input
                  type="text"
                  className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                  name={field}
                  value={shippingAddress[field]}
                  onChange={handleChange}
                />
                {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Order Summary</h4>
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between">
                <span>Items</span>
                <strong>{cartItems.length}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Subtotal</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Shipping</span>
                <strong>FREE</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </li>
            </ul>
            <p className="note">
               <strong>Note:</strong> Currently we are only accepting online payments.<br />
                We are working on COD. Sorry for the inconvenience.
            </p>
            <button className="btn btn-primary w-100" onClick={handlePayment}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
