import React from 'react';
import {BarChart3} from "lucide-react";

const Sidebar = ({ animated = false }) => (
    <div className={`w-64 bg-gray-900 text-white p-6 ${animated ? 'animate-slideInLeft' : ''}`}>
        <div className="flex items-center space-x-2 mb-8">
            <BarChart3 className="w-8 h-8" />
            <span className="text-xl font-bold">Analytics</span>
        </div>
        <nav className="space-y-2">
            {["Dashboard", "Reports", "Users", "Settings"].map((item, idx) => (
                <a key={idx} href="#" className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors">
                    {item}
                </a>
            ))}
        </nav>
    </div>
);

export default Sidebar;