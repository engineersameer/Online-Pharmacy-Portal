import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const orderApi = axios.create({
  baseURL: `${API_URL}/order`,
});

orderApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const placeOrder = async (formData) => {
  try {
    const response = await orderApi.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Normalize error message
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to place order'
    );
  }
};

// Get all orders for a customer
export const getCustomerOrders = async (userId) => {
  try {
    const response = await orderApi.get(`/customer/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to fetch orders'
    );
  }
};

// Update a pending order
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await orderApi.put(`/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to update order'
    );
  }
};

// Delete a pending order
export const deleteOrder = async (orderId) => {
  try {
    const response = await orderApi.delete(`/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to delete order'
    );
  }
}; 