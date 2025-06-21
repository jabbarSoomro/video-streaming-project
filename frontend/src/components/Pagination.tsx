import React from 'react';

const Pagination = ({ animated = false }) => (
    <div className={`p-6 border-t border-gray-200 ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">
        Showing 1 to 6 of 120 results
      </span>
            <div className="flex space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Previous</button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-md">1</button>
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Next</button>
            </div>
        </div>
    </div>
);

export default Pagination