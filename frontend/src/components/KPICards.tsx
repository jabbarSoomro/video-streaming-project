import React from "react";

const KPICards = ({ animated = false }) => (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 p-6 ${animated ? 'animate-fadeIn' : ''}`}>
        {[
            { title: "Total Users", value: "12,345", change: "+12%" },
            { title: "Revenue", value: "$45,678", change: "+8%" },
            { title: "Conversion", value: "3.2%", change: "+0.5%" },
            { title: "Sessions", value: "89,012", change: "+15%" }
        ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{kpi.title}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                    <span className="text-sm text-green-600">{kpi.change}</span>
                </div>
            </div>
        ))}
    </div>
);

export default KPICards;