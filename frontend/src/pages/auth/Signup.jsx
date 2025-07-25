import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import { signup } from '../../services/authService';

// Helper arrays
const AGE_OPTIONS = Array.from({ length: 83 }, (_, i) => ({
  value: String(18 + i),
  label: String(18 + i)
}));

const CITY_OPTIONS = [
  { value: 'lahore', label: 'Lahore' },
  { value: 'karachi', label: 'Karachi' },
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'rawalpindi', label: 'Rawalpindi' },
  { value: 'faisalabad', label: 'Faisalabad' },
  { value: 'multan', label: 'Multan' },
  { value: 'peshawar', label: 'Peshawar' },
  { value: 'quetta', label: 'Quetta' },
];

function Signup() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    phone: '',
    address: '',
    city: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Regex for phone validation
  const phoneRegex = /^\+?[\d\s-]{10,}$/;

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(score);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'password') calculateStrength(value);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await signup(formData);
      console.log('✅ Signup success:', response);
      setApiMessage('Registration successful! Redirecting to Sign In...');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      console.error('❌ Signup error:', error);
      setApiMessage(error.message || 'Registration failed. Please try again.');
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
          <h2 className={`text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create your account</h2>
          <p className={`mt-2 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-primary-600 hover:text-primary-500">Sign in</Link>
          </p>
        </div>

        {/* API / Validation message */}
        {apiMessage && (
          <div className="text-center text-sm text-red-600 dark:text-red-400">{apiMessage}</div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="Full Name" />

          <FormSelect label="Age" name="age" value={formData.age} onChange={handleChange} options={AGE_OPTIONS} error={errors.age} required placeholder="Select Age" />

          {/* Gender */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gender</label>
            <div className="mt-2 flex gap-6">
              {['male', 'female'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="text-primary-600" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <FormInput label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required placeholder="e.g. +92 300 1234567" />

          {/* Address */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Address<span className="text-red-500 ml-1">*</span></label>
            <textarea name="address" rows="3" value={formData.address} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white focus:border-primary-500 focus:ring-primary-500' : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500'} ${errors.address ? 'border-red-500' : ''}`} placeholder="Enter your address" />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <FormSelect label="City" name="city" value={formData.city} onChange={handleChange} options={CITY_OPTIONS} error={errors.city} required placeholder="Select City" />

          {/* Password */}
          <div className="space-y-2">
            <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required placeholder="Create a strong password" showPasswordToggle />
            {/* Strength bar */}
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded">
              <div className={`${passwordStrength <= 1 ? 'bg-red-500' : passwordStrength === 2 ? 'bg-yellow-500' : passwordStrength === 3 ? 'bg-blue-500' : 'bg-green-500'} h-full rounded transition-all duration-300`} style={{ width: `${(passwordStrength / 5) * 100}%` }} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}>{isLoading ? 'Signing up…' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
}

export default Signup; 