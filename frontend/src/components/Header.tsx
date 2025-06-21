import React from 'react';

const Header = ({ animated = false }) => (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
                <span className="text-xl font-bold text-gray-900">ProductivePro</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            </nav>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Get Started
            </button>
        </div>
    </header>
);

export default Header;

