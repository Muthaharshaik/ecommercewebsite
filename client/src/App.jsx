import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';  // <-- import Toaster
import HomePage from './pages/HomePage';
import Header from './components/Navbar';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/PDP';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/Login';
import Cart from './pages/CartPage';

function App() {
  return (
    <>
      <Header />
      <Toaster position="top-right" /> {/* <-- Add this */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;

