import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getCustomerOrders } from '../../services/orderService';
import { getCurrentUser } from '../../services/authService';
import OrderCard from '../../components/orders/OrderCard';

function Orders() {
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStatus, setActiveStatus] = useState('pending');

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { value: 'processing', label: 'In Progress', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )},
    { value: 'completed', label: 'Completed', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )}
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = getCurrentUser();
        if (!user?._id) {
          throw new Error('User not found');
        }

        const response = await getCustomerOrders(user._id);
        setOrders(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  const handleOrderDelete = (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
  };

  // Group orders by status
  const groupedOrders = orders.reduce((acc, order) => {
    const status = order.status || 'pending';
    if (!acc[status]) acc[status] = [];
    acc[status].push(order);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap justify-center mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {statusOptions.map(status => (
          <button
            key={status.value}
            onClick={() => setActiveStatus(status.value)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 min-w-[120px] justify-center
              ${activeStatus === status.value
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {status.icon}
            <span>{status.label}</span>
          </button>
        ))}
      </div>
 
      {orders.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start by creating a new order.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders
              .filter(order => order.status === activeStatus)
              .map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onUpdate={handleOrderUpdate}
                  onDelete={handleOrderDelete}
                />
              ))
            }
          </div>
          {orders.filter(order => order.status === activeStatus).length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No {activeStatus} orders found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Orders; 