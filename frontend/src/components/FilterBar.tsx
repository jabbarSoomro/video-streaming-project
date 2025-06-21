import React from 'react';
import {Filter, Search} from "lucide-react";

const FilterBar = ({ animated = false }) => (
    <div className={`bg-white p-6 border-b border-gray-200 ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search properties..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
            </button>
        </div>
    </div>
);

export default FilterBar;