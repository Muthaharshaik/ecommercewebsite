import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseUrl = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_API_BASE_URL;


const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await axios.post(`${baseUrl}/api/users/register`, form, { withCredentials: true });
      setMessage({ type: 'success', text: 'Registered successfully!' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Registration failed',
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '450px' }}>
        <h3 className="text-center mb-4">Register</h3>

        {message.text && (
          <div
            className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} py-2 small`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
