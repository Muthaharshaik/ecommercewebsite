import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
const baseUrl = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_API_BASE_URL;


const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/api/categories/${categoryName}`)
      .then(res => {
        setProducts(res.data.products || []);
      })
      .catch(err => {
        console.error(err);
        setProducts([]);
      });
  }, [categoryName]);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">
        {categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : ''}
      </h2>

      {products.length === 0 ? (
        <p className="text-center">No products found in this category.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map(product => (
            <div className="col" key={product._id}>
               <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    className="card-img-top" 
                    alt={product.name} 
                    style={{ objectFit: 'contain', height: '200px' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-truncate" title={product.description}>
                      {product.description || "No description available."}
                    </p>
                    <div className="mt-auto fw-bold">
                      ₹{product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

