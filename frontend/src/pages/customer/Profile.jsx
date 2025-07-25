import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getProfile, updateProfile } from '../../services/customerService';
import FormInput from '../../components/forms/FormInput';

function Profile() {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    city: '',
    password: ''
  });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name || '',
        age: response.data.age || '',
        gender: response.data.gender || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        city: response.data.city || '',
        password: ''
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Check password strength
    if (name === 'password' && value) {
      const score = calculatePasswordStrength(value);
      setPasswordStrength(score);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    let message = '';

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        message = 'Weak';
        break;
      case 2:
      case 3:
        message = 'Medium';
        break;
      case 4:
      case 5:
        message = 'Strong';
        break;
      default:
        message = '';
    }

    return { score, message };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) delete dataToUpdate.password;

      const response = await updateProfile(dataToUpdate);
      setProfile(response.data);
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);

      // Clear password field
      setFormData(prev => ({ ...prev, password: '' }));
      setPasswordStrength({ score: 0, message: '' });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors duration-200
            ${isEditing
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              : 'bg-primary-600 text-white hover:bg-primary-700'
            }
          `}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          {successMsg}
        </div>
      )}

      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${isEditing ? 'border-2 border-primary-500' : 'border border-gray-200 dark:border-gray-700'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <FormInput
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          <FormInput
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          {isEditing && (
            <div>
              <FormInput
                label="New Password (leave blank to keep current)"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                showPasswordToggle
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2
                          ? 'bg-red-500'
                          : passwordStrength.score <= 3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className={`text-sm mt-1 ${
                    passwordStrength.score <= 2
                      ? 'text-red-500'
                      : passwordStrength.score <= 3
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}>
                    Password Strength: {passwordStrength.message}
                  </p>
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile; 