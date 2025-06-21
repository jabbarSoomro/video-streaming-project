import React from 'react';
const DataTable = ({ animated = false }) => (
    <div className={`p-6 ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {[
                        { user: "John Doe", action: "Created report", date: "2 hours ago" },
                        { user: "Jane Smith", action: "Updated profile", date: "4 hours ago" },
                        { user: "Mike Johnson", action: "Logged in", date: "6 hours ago" }
                    ].map((row, idx) => (
                        <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.user}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.action}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
export default DataTable