import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import ErrorMessages from '../../components/ErrorMessages';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || ['Login failed. Please try again.']);
        return;
      }

      // Login successful - redirect to home
      navigate('/');
    } catch (error) {
      setErrors(['An error occurred. Please try again.']);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <Nav />
      </header>
      <main className="min-h-screen mt-32">
        {/* heading */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login to Your Account
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
          >
            {/* error messages */}
            {errors.length > 0 && <ErrorMessages errors={errors} />}

            <div className="mb-6">
              {/* Email Address */}
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold m-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Password */}
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold m-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Login button */}
            <input
              type="submit"
              value={loading ? 'Logging in...' : 'Login'}
              disabled={loading}
              className="w-full bg-[#ff5a5f] hover:bg-[#ff4b51] disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors mb-3 cursor-pointer"
            />

            <div className="text-center">
              <span>Don't have an account?</span>
              <a href="/signup" className="text-blue-600 underline ml-1">
                Sign up here
              </a>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}