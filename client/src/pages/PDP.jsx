import {useState, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';

const ProductDetailsPage = ()=> {
    const {id} = useParams();
    const [product, setProduct] = useState(null);

    useEffect(()=>{
        axios.get(`/api/products/${id}`)
        .then(res => {
            setProduct(res.data)
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        })
    }, [id])

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
          
          <button className="btn btn-primary mt-3">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
