//We will manage the cart data by creating cart context api to share the data among the pages.

import React, {useContext, createContext, useEffect, useState} from "react";
import axios from "axios";
import { useUser } from "./userContext";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const CartContext = createContext();
export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useUser();
    // Fetch cart items for the logged-in user
    const fetchCart = async() => {
        try {
            const res = await axios.get(`${baseUrl}/api/cart`, { withCredentials: true });
            setCartItems(res.data.products)
        } catch(error) {
            console.log("Error while fetching cart", error)
        }
    };
    //Add to cart
    const addToCart = async(productId, quantity = 1) => {
       try {
          const res = await axios.post(`${baseUrl}/api/cart`, { productId,quantity}, { withCredentials: true });
          setCartItems(res.data.products);
       } catch(error) {
          console.log("Error while adding product to the cart",error)
       }
    };

    //clearing cart on logout
    const clearCart = () => {
        setCartItems([]);
    };
    
    //updating cart
    const updateCart = async (productId, quantity) => {
        try {
            const res = await axios.put(`${baseUrl}/api/cart`, { productId, quantity}, { withCredentials: true});
            setCartItems(res.data.products) //update products
        } catch(error) {
            console.log("Failed to update cart", error)
        }
    }

    const increaseQty = (productId) => {
      updateCart(productId, 1); //increment
    };

    const decreaseQty = (productId) => {
      updateCart(productId, -1); //decrement
    };

    //Removing product
    const removeItem = async (productId) => {
        try {
            const res = await axios.delete(`${baseUrl}/api/cart/${productId}` ,{withCredentials :true})
            setCartItems(res.data.products)
        } catch(error) {
            console.log("Unable to remove product from cart",error)
        }
    }


    useEffect(() => {
      if (user) {
      fetchCart(); // refetch cart when user logs in or refresh happens
     } else {
      setCartItems([]); // clear cart for guests
    }
   }, [user]);

    return (
       <CartContext.Provider value={{ cartItems, setCartItems, addToCart, fetchCart, 
       clearCart, increaseQty, decreaseQty, removeItem }}>
           {children}
       </CartContext.Provider>
    );

}

export const useCart = () => useContext(CartContext)