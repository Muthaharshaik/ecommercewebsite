import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Navbar';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/PDP';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/Login';



function App() {
  return (
    <>
    <Header/>
    <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="/register" element={<RegisterPage />} />
       <Route path="/login" element={<LoginPage />} />
       <Route path="/category/:categoryName" element={<CategoryPage />} />
       <Route path="/products/:id" element={<ProductDetailsPage />} />
    </Routes>
    </>
  );
}

export default App;

