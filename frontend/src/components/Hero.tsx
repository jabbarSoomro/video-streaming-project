import React from 'react';
const Hero = ({ animated = false }) => (
    <section className={`bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-6 ${animated ? 'animate-slideInUp' : ''}`}>
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Boost Your Productivity
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Streamline your workflow with our all-in-one productivity suite.
                Manage tasks, collaborate with teams, and achieve more every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-700 transition-colors">
                    Start Free Trial
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg hover:bg-gray-50 transition-colors">
                    Watch Demo
                </button>
            </div>
        </div>
    </section>
);

export default Hero;

