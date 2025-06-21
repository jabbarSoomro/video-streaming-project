import React from "react";
const Footer = ({ animated = false }) => (
    <footer className={`bg-gray-900 text-white py-12 px-6 ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        <span className="text-xl font-bold">ProductivePro</span>
                    </div>
                    <p className="text-gray-400">Making productivity simple and effective.</p>
                </div>
                {["Product", "Company", "Support"].map((section, idx) => (
                    <div key={idx}>
                        <h4 className="font-semibold mb-4">{section}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Link 1</a></li>
                            <li><a href="#" className="hover:text-white">Link 2</a></li>
                            <li><a href="#" className="hover:text-white">Link 3</a></li>
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 ProductivePro. All rights reserved.</p>
            </div>
        </div>
    </footer>
);
export default Footer;