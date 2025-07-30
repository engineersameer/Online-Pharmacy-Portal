import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import FormInput from '../../components/forms/FormInput';
import { signin } from '../../services/authService';

function SignIn() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const phoneRegex = /^\+?[\d\s-]{10,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await signin(formData);
      console.log('✅ Signin success:', response);
      setApiMessage('Sign in successful! Redirecting...');

      const user = JSON.parse(localStorage.getItem('user'));
      const userRole = user?.role;

      // Redirect based on role
      const redirectPath = userRole === 'customer' ? '/customer' : '/';
      setTimeout(() => navigate(redirectPath), 800);
    } catch (error) {
      console.error('❌ Signin error:', error);
      setApiMessage(error.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Back Button */}
      <Link
        to="/"
        className={`absolute top-4 left-4 p-2 flex items-center space-x-2 rounded-lg transition-all duration-200 group ${
          isDarkMode 
            ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        <svg 
          className="w-5 h-5 transform transition-transform group-hover:-translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <Link to="/" className="flex justify-center items-center mb-6">
            <span className="ml-2 text-2xl font-bold text-primary-600">PharmaCare</span>
          </Link>
          <h2 className={`text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sign in to your account</h2>
          <p className={`mt-2 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Or{' '}<Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">create a new account</Link></p>
        </div>

        {apiMessage && <div className="text-center text-sm text-red-600 dark:text-red-400">{apiMessage}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormInput label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required placeholder="e.g. +92 300 1234567" />
          <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required placeholder="Enter your password" showPasswordToggle />
          <button type="submit" disabled={isLoading} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}>{isLoading ? 'Signing in…' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn; 