import React, { useEffect, useMemo, useState } from 'react';
import { admin } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const AdminCustomers = () => {
  const { isDarkMode } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('customers'); // 'customers' | 'admins'
  const [confirmUser, setConfirmUser] = useState(null); // user object for confirmation modal

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await admin.users.getAll();
        if (mounted) {
          setCustomers(res.data?.data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = customers;

    // Apply role filter
    base = base.filter((c) => (roleFilter === 'admins' ? c.IsAdmin : !c.IsAdmin));

    if (!q) return base;
    return base.filter((c) => {
      return (
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        String(c.age || '').includes(q)
      );
    });
  }, [customers, query, roleFilter]);

  const handleDelete = (id) => {
    const target = customers.find((c) => c._id === id);
    if (!target) return;
    setConfirmUser(target);
  };

  const handleConfirmDelete = async () => {
    if (!confirmUser?._id) return;
    try {
      setDeletingId(confirmUser._id);
      await admin.users.deleteUser(confirmUser._id);
      setCustomers((prev) => prev.filter((c) => c._id !== confirmUser._id));
      setConfirmUser(null);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-primary-600">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span>Loading customers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className={`px-4 py-3 rounded-md ${isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-700'}`}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pb-10">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Directory</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Manage all registered users</p>
          </div>

          {/* Search */}
          <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by name, phone, city..."
            className={`w-full sm:w-80 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white focus:ring-primary-600'
                : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-600'
            }`}
          />
          <svg className={`w-5 h-5 absolute right-3 top-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          </div>
        </div>

        {/* Role filter toggle */}
        <div className={`inline-flex w-fit rounded-xl p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`} role="tablist" aria-label="User type">
          <button
            onClick={() => setRoleFilter('customers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              roleFilter === 'customers'
                ? isDarkMode
                  ? 'bg-white text-gray-900'
                  : 'bg-white text-gray-900'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-pressed={roleFilter === 'customers'}
          >
            Customers
          </button>
          <button
            onClick={() => setRoleFilter('admins')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              roleFilter === 'admins'
                ? isDarkMode
                  ? 'bg-white text-gray-900'
                  : 'bg-white text-gray-900'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-pressed={roleFilter === 'admins'}
          >
            Admins
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`text-center py-20 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
          No customers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c._id}
              className={`group rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
                isDarkMode
                  ? 'bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700 hover:border-primary-700'
                  : 'bg-white border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{c.name}</h3>
                    {c.IsAdmin && (
                      <span className="text-xs px-2 py-0.5 rounded bg-primary-100 text-primary-700">Admin</span>
                    )}
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{c.phone}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Age</p>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{c.age ?? '-'}</p>
                </div>
                <div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gender</p>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{c.gender ?? '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{c.address ?? '-'}</p>
                </div>
                <div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>City</p>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{c.city ?? '-'}</p>
                </div>
                <div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Joined</p>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>ID: {c._id}</span>
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={deletingId === c._id || c.IsAdmin}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    c.IsAdmin
                      ? 'opacity-50 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-gray-900'
                        : 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 focus:ring-offset-white'
                  }`}
                  title={c.IsAdmin ? 'Cannot delete admin user' : 'Delete user'}
                >
                  {deletingId === c._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className={`absolute inset-0 bg-black/50 ${isDarkMode ? '' : ''}`}
            onClick={() => setConfirmUser(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className={`relative mx-4 w-full max-w-md rounded-2xl p-6 shadow-xl ${
              isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <svg
                  className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.64 5.64l12.72 12.72M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Delete user?</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Are you sure you want to delete{' '}
                  <span className="font-medium">{confirmUser.name}</span>
                  {confirmUser.phone ? ` (${confirmUser.phone})` : ''}? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={!!deletingId}
                className={`px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-gray-900'
                    : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-white'
                }`}
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;