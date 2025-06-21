import React from 'react';
import {MapPin} from "lucide-react";

const RealEstateSidebar = ({ animated = false }) => (
    <div className={`w-80 bg-gray-50 p-6 border-l border-gray-200 ${animated ? 'animate-slideInRight' : ''}`}>
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Agents</h3>
            <div className="space-y-4">
                {["Sarah Wilson", "Mike Rodriguez"].map((agent, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                            <div className="font-medium text-gray-900">{agent}</div>
                            <div className="text-sm text-gray-500">Real Estate Agent</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Map View</h3>
            <div className="h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-500" />
                <span className="ml-2 text-gray-500">Map Placeholder</span>
            </div>
        </div>
    </div>
);

export default RealEstateSidebar;