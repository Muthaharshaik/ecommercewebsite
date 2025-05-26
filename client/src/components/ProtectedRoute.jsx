import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { useCart } from '../context/cartContext';

const ProtectedCheckoutRoute = ({ children }) => {
  const { user } = useUser();
  const { cartItems } = useCart();

  if (!user || cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return children;
};

export default ProtectedCheckoutRoute;