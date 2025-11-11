import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getProfile, updateProfile } from '../../services/customerService';
import FormInput from '../../components/forms/FormInput';

const AdminProfile = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' });
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    city: '',
    password: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setFormData({
          name: res.data?.name || '',
          age: res.data?.age || '',
          gender: res.data?.gender || '',
          phone: res.data?.phone || '',
          address: res.data?.address || '',
          city: res.data?.city || '',
          password: ''
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const joinedLabel = useMemo(() => {
    if (!profile?.createdAt) return 'Joined recently';
    return `Joined on ${new Date(profile.createdAt).toLocaleDateString()}`;
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      if (!value) {
        setPasswordStrength({ score: 0, label: '' });
        return;
      }
      const requirements = [
        value.length >= 8,
        /[A-Z]/.test(value),
        /[a-z]/.test(value),
        /[0-9]/.test(value),
        /[^A-Za-z0-9]/.test(value)
      ];
      const score = requirements.filter(Boolean).length;
      const labelMap = ['Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
      setPasswordStrength({ score, label: labelMap[score] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setSaving(true);
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      const res = await updateProfile(payload);
      setProfile(res.data);
      setFormData((prev) => ({ ...prev, password: '' }));
      setPasswordStrength({ score: 0, label: '' });
      setSuccess('Profile updated successfully.');
      setIsEditing(false);

      // Sync local storage user metadata
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = {
            ...parsed,
            name: res.data?.name ?? parsed.name,
            phone: res.data?.phone ?? parsed.phone
          };
          localStorage.setItem('user', JSON.stringify(updated));
        }
      } catch (storageErr) {
        console.warn('Failed to sync user in localStorage', storageErr);
      }

      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3 text-primary-600">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-300">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="px-6 py-4 rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
          {error}
        </div>
      </div>
    );
  }

  const cardBase = isDarkMode
    ? 'bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700'
    : 'bg-white border border-gray-200 shadow-sm';

  const labelStyle = 'text-xs uppercase tracking-wide text-gray-400';
  const valueStyle = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pb-16 space-y-8">
      <section className={`${cardBase} rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6`}>
        <div className="flex items-start md:items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl font-semibold ${
              isDarkMode ? 'bg-primary-500/20 text-primary-200' : 'bg-primary-50 text-primary-600'
            }`}>
              {profile?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold bg-primary-600 text-white uppercase tracking-wide">
              Admin
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">{profile?.name}</h1>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{joinedLabel}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
              <span className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                {profile?.phone}
              </span>
              <span className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                {profile?.city || 'City not set'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode
                ? isEditing
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-primary-400 focus:ring-offset-gray-900'
                  : 'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-400 focus:ring-offset-gray-900'
                : isEditing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-primary-500 focus:ring-offset-white'
                  : 'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500 focus:ring-offset-white'
            }`}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
      </section>

      {error && profile && (
        <div className={`px-5 py-3 rounded-xl border text-sm ${isDarkMode ? 'border-red-800 bg-red-900/40 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {error}
        </div>
      )}

      {success && (
        <div className={`px-5 py-3 rounded-xl border text-sm ${isDarkMode ? 'border-emerald-800 bg-emerald-900/40 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {success}
        </div>
      )}

      <section className={`${cardBase} rounded-3xl p-6 sm:p-8`}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className={labelStyle}>Full name</span>
              <FormInput
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing || saving}
                required
              />
            </div>
            <div className="space-y-2">
              <span className={labelStyle}>Phone number</span>
              <FormInput
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing || saving}
                required
              />
            </div>
            <div className="space-y-2">
              <span className={labelStyle}>Age</span>
              <FormInput
                name="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleInputChange}
                disabled={!isEditing || saving}
                required
              />
            </div>
            <div className="space-y-2">
              <span className={labelStyle}>Gender</span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing || saving}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <span className={labelStyle}>Address</span>
              <FormInput
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing || saving}
                required
              />
            </div>
            <div className="space-y-2">
              <span className={labelStyle}>City</span>
              <FormInput
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing || saving}
                required
              />
            </div>
          </div>

          {isEditing && (
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <span className={labelStyle}>Update password</span>
                <FormInput
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={saving}
                  showPasswordToggle
                />
              </div>
              {formData.password && (
                <div className="space-y-2">
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2
                          ? 'bg-red-500'
                          : passwordStrength.score === 3
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.score <= 2
                      ? 'text-red-500'
                      : passwordStrength.score === 3
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                  }`}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-6 flex items-center justify-between flex-wrap gap-3">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Changes update the admin account used across the portal.
            </div>
            {isEditing && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: profile?.name || '',
                      age: profile?.age || '',
                      gender: profile?.gender || '',
                      phone: profile?.phone || '',
                      address: profile?.address || '',
                      city: profile?.city || '',
                      password: ''
                    });
                    setPasswordStrength({ score: 0, label: '' });
                    setIsEditing(false);
                    setError('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-primary-400 focus:ring-offset-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-primary-500 focus:ring-offset-white'
                  }`}
                  disabled={saving}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </form>
      </section>

      {profile && (
        <section className={`${cardBase} rounded-3xl p-6 sm:p-8 grid gap-6 sm:grid-cols-3`}>
          <div>
            <span className={labelStyle}>Account ID</span>
            <p className={`${valueStyle} break-all text-sm mt-1`}>{profile._id}</p>
          </div>
          <div>
            <span className={labelStyle}>Role</span>
            <p className={`${valueStyle} mt-1`}>{profile.IsAdmin ? 'Administrator' : 'Customer'}</p>
          </div>
          <div>
            <span className={labelStyle}>Status</span>
            <p className={`${valueStyle} mt-1`}>Active</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminProfile;