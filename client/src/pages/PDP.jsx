import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/cartContext';
import { useUser } from '../context/userContext';
import toast from 'react-hot-toast';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();

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
    if (!user) {
      toast.error('Please login to add items to cart');
      setTimeout(() => navigate('/'), 4000);
      return;
    }

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

