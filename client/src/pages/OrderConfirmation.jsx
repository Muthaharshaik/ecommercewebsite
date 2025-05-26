import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderConfirmation.css'; // add styling here

const OrderConfirmation = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          No order details found.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 order-confirmation">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-success">🎉 Thank You for Your Purchase!</h2>
        <p className="lead">Your order has been placed successfully.</p>

        <hr />

        <h4 className="mb-3">📦 Order Details</h4>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>

        <h5 className="mt-4 mb-2">📍 Shipping Address</h5>
        <p>
            {order.shippingAddress?.street}, {order.shippingAddress?.postalCode}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
            {order.shippingAddress?.country}
        </p>

        <div className="mt-4">
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

