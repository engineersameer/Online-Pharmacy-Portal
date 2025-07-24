// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  GUEST: 'guest',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Theme Colors (matching Tailwind config)
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    700: '#15803d',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    700: '#b91c1c',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    700: '#b45309',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
  },
  CUSTOMER: {
    HOME: '/customer',
    ORDERS: '/customer/orders',
    PROFILE: '/customer/profile',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
  },
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_REGEX: /^\+?[\d\s-]{10,}$/,
}; 