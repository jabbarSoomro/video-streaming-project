import React from 'react';
const Features = ({ animated = false }) => (
    <section className={`py-16 px-6 bg-white ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Task Management", desc: "Organize and prioritize your work efficiently" },
                    { title: "Team Collaboration", desc: "Work together seamlessly with your team" },
                    { title: "Analytics Dashboard", desc: "Track progress with detailed insights" }
                ].map((feature, idx) => (
                    <div key={idx} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
export default Features;

