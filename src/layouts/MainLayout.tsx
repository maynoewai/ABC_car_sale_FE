import { Outlet } from 'react-router-dom';
// import { Car, ShoppingBag, User } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-600">
                Premium used cars with verified history and quality assurance.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/cars/list" className="text-gray-600 hover:text-primary-600">
                    Browse Cars
                  </a>
                </li>
                <li>
                  <a href="/sell" className="text-gray-600 hover:text-primary-600">
                    Sell Your Car
                  </a>
                </li>
                <li>
                  <a href="/about-us" className="text-gray-600 hover:text-primary-600">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Email: info@ABC Cars.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Luxury Lane, Beverly Hills, CA 90210</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} ABC Cars. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}