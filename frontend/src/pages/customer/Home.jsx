import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/orderService';
import FormInput from '../../components/forms/FormInput';
import { useTheme } from '../../contexts/ThemeContext';
import { getCurrentUser } from '../../services/authService';

function Home() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    receiverName: '',
    phone: '',
    address: '',
  });

  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Prefill address if checkbox toggled
  useEffect(() => {
    if (useSavedAddress && currentUser?.address) {
      setForm(prev => ({ ...prev, address: currentUser.address }));
    }
  }, [useSavedAddress, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.receiverName.trim()) newErrors.receiverName = 'Receiver name is required';

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phonePattern = /^\+?[0-9]{7,15}$/; // basic intl phone pattern
      if (!phonePattern.test(form.phone.trim())) newErrors.phone = 'Invalid phone number format';
    }

    if (!form.address.trim()) newErrors.address = 'Address is required';

    if (!file) newErrors.file = 'Prescription file is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('receiverName', form.receiverName);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      formData.append('userId', currentUser?._id);
      formData.append('prescription', file);

      const res = await placeOrder(formData);
      setSuccessMsg(res.message || 'Order placed successfully and is pending review!');
      setForm({ receiverName: '', phone: '', address: '' });
      setFile(null);
      setUseSavedAddress(false);

      // Optionally navigate or refresh orders
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      setErrors({ apiError: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-3xl mx-auto p-6 mt-24 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-6">Order Medicine</h1>
      {successMsg && (
        <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 animate-fade-in">
          {successMsg}
        </div>
      )}
      {errors.apiError && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-fade-in">
          {errors.apiError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Receiver Name"
          name="receiverName"
          value={form.receiverName}
          onChange={handleChange}
          required
          error={errors.receiverName}
        />

        <FormInput
          label="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="e.g. +15551234567"
          error={errors.phone}
        />

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Address <span className="text-red-500">*</span></label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
            }`}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
        </div>

        {/* Use saved address checkbox */}
        {currentUser?.address && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="savedAddress"
              checked={useSavedAddress}
              onChange={() => setUseSavedAddress(!useSavedAddress)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="savedAddress" className="text-sm">Use my saved login address</label>
          </div>
        )}

        {/* File upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Prescription (PDF or Image) <span className="text-red-500">*</span></label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
          />
          {errors.file && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.file}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
            isSubmitting ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
}

export default Home; 