import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUSPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            About ABC car
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-200 drop-shadow">
            Redefining Luxury Used Car Sales
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Who We Are
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            At ABC car, our mission is to provide a curated selection of premium pre-owned vehicles that blend luxury, performance, and reliability. With years of industry expertise, our team ensures that every car in our inventory undergoes rigorous inspections and quality checks—so you can drive away with complete confidence. Our passion for automotive excellence drives us to deliver not only outstanding vehicles but also an exceptional buying experience.
          </p>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            We believe that buying a car should be as enjoyable as driving one. That's why we strive to create a seamless, transparent, and personalized experience for every customer. Join us on a journey of sophistication, innovation, and unparalleled service.
          </p>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Get in Touch
              </h3>
              <p className="text-gray-600 mb-6">
                Have questions or need assistance? Our team is here to help. Reach out to us using the information below.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">info@ABC car.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">+1 234 567 890</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">123 Luxury Ave, Beverly Hills, CA</span>
                </li>
              </ul>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Send Us a Message
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    placeholder="Enter your message"
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
