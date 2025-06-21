import React from 'react';
import {Bath, Bed, Square} from "lucide-react";

const PropertyGrid = ({ animated = false }) => (
    <div className={`p-6 ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((property) => (
                <div key={property} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Modern Family Home
                        </h3>
                        <p className="text-gray-600 mb-3">123 Oak Street, Downtown</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                                <Bed className="w-4 h-4 mr-1" />
                                3 beds
                            </div>
                            <div className="flex items-center">
                                <Bath className="w-4 h-4 mr-1" />
                                2 baths
                            </div>
                            <div className="flex items-center">
                                <Square className="w-4 h-4 mr-1" />
                                1,200 sq ft
                            </div>
                        </div>
                        <div className="text-xl font-bold text-blue-600">$450,000</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default PropertyGrid