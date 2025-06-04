import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/cartContext';
import toast from 'react-hot-toast';
const baseUrl = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_API_BASE_URL;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();


  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

  const handleAddToCart = async () => {

    try {
      await addToCart(product._id,1);
      toast.success('Added to cart');
    } catch (err) {
      console.log(err)
      toast.error('Failed to add to cart');
    }
  };

  if (!product) {
    return <div className="text-center mt-5">Product not found.</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={product.image || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description || 'No description available.'}</p>
          <h4 className="text-success fw-bold">₹{product.price.toFixed(2)}</h4>

          <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

