import React from 'react';
import {Settings} from "lucide-react";
const DashboardHeader = ({ animated = false }) => (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Settings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    </header>
);
export default DashboardHeader;