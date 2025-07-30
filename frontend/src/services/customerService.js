import api from './api';

// Get customer profile
export const getProfile = async () => {
  try {
    const response = await api.get('/customers/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to fetch profile'
    );
  }
};

// Update customer profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/customers/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to update profile'
    );
  }
}; 