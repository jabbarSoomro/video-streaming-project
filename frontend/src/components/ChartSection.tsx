import React from 'react';
import {BarChart3} from "lucide-react";
const ChartSection = ({ animated = false }) => (
    <div className={`p-6 ${animated ? 'animate-slideInUp' : ''}`}>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <BarChart3 className="w-16 h-16 text-gray-400" />
                <span className="ml-4 text-gray-500">Chart Placeholder</span>
            </div>
        </div>
    </div>
);
export default ChartSection;