import { useTheme } from '../contexts/ThemeContext';
import WelcomeHeader from '../components/WelcomeHeader';
import CustomerHeader from '../components/CustomerHeader';
import { useLocation } from 'react-router-dom';

function MainLayout({ children }) {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const isCustomer = location.pathname.startsWith('/customer');

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {isCustomer ? <CustomerHeader /> : <WelcomeHeader />}

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                PharmaCare
              </h3>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your trusted healthcare partner, providing quality pharmaceutical services 24/7.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Links
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="/about" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/services" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                    Services
                  </a>
                </li>
                <li>
                  <a href="/contact" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact Us
              </h3>
              <ul className="mt-2 space-y-2">
                <li className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="font-medium">Email:</span> info@pharmacare.com
                </li>
                <li className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="font-medium">Phone:</span> +1 (555) 123-4567
                </li>
                <li className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className="font-medium">Address:</span> 123 Health Street, Medical District
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © {new Date().getFullYear()} PharmaCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout; 