import React from 'react';
import {Star} from "lucide-react";

const Testimonials = ({ animated = false }) => (
    <section className={`py-16 px-6 bg-gray-50 ${animated ? 'animate-fadeIn' : ''}`}>
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                What Our Users Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
                {[
                    { name: "Sarah Johnson", role: "Product Manager", text: "This tool has revolutionized how our team works together." },
                    { name: "Mike Chen", role: "Startup Founder", text: "Finally, a productivity app that actually makes me more productive." }
                ].map((testimonial, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                        </div>
                        <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                            <div>
                                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                <div className="text-gray-500 text-sm">{testimonial.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Testimonials