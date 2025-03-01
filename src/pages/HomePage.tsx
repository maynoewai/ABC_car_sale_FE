import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Menu, X, Shield, Star, Truck, User } from 'lucide-react';

export default function HomePage() {
  // Check if user is logged in via localStorage token
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[600px] flex items-center justify-center"
        style={{
          backgroundImage:
          'url(https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative text-center text-white px-4 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            Discover Your Dream Luxury Car
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
            Explore our exclusive collection of premium pre-owned vehicles,
            all with verified history and unparalleled quality.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Link
              to="/cars/list"
              className="btn-primary text-lg px-8 py-3 transition transform hover:scale-105"
            >
              Browse Cars
            </Link>
            {isLoggedIn ? (
              <Link
                to="/sell-car"
                className="btn-secondary text-lg px-8 py-3 transition transform hover:scale-105"
              >
                Sell Your Car
              </Link>
            ) : (
              <Link
                to="/signup"
                className="btn-secondary text-lg px-8 py-3 transition transform hover:scale-105"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why Choose ABC car?
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Experience quality, performance, and luxury with every vehicle.
            Our rigorous inspections, premium selections, and exceptional
            customer service ensure you drive away with confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 mb-4 mx-auto">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Every vehicle undergoes extensive inspections to ensure top
                quality and safety.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 mb-4 mx-auto">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Premium Selection</h3>
              <p className="text-gray-600">
                Enjoy a curated collection of the finest luxury vehicles in the
                market.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 mb-4 mx-auto">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Nationwide Delivery</h3>
              <p className="text-gray-600">
                Benefit from our comprehensive door-to-door delivery services,
                wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4">
                <Truck className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
              <p className="text-gray-600">
                Search through our extensive inventory and find the perfect car
                that suits your lifestyle.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4">
                <Car className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Bid</h3>
              <p className="text-gray-600">
                Engage with sellers and place competitive bids on your dream car.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4">
                <User className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Test Drive & Purchase</h3>
              <p className="text-gray-600">
                Book a test drive, experience the vehicle firsthand, and finalize
                your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg transition transform hover:scale-105">
              <p className="italic text-gray-600 mb-4">
                "ABC car transformed my car buying journey. The quality, service,
                and attention to detail were unmatched. I couldn’t be happier with my new ride."
              </p>
              <h4 className="font-bold text-gray-800">Alex Johnson</h4>
              <span className="text-gray-500">New York, NY</span>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg transition transform hover:scale-105">
              <p className="italic text-gray-600 mb-4">
                "The premium selection and effortless test drive booking made it
                easy for me to choose my dream car. ABC car is the best in the business!"
              </p>
              <h4 className="font-bold text-gray-800">Emily Davis</h4>
              <span className="text-gray-500">Los Angeles, CA</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
