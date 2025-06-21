import React from 'react';
import {Check} from "lucide-react";

const Pricing = ({ animated = false }) => (
    <section className={`py-16 px-6 bg-white ${animated ? 'animate-slideInUp' : ''}`}>
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Simple Pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { name: "Basic", price: "$9", features: ["5 Projects", "Basic Analytics", "Email Support"] },
                    { name: "Pro", price: "$19", features: ["Unlimited Projects", "Advanced Analytics", "Priority Support"], popular: true },
                    { name: "Enterprise", price: "$49", features: ["Custom Integration", "Dedicated Manager", "SLA"] }
                ].map((plan, idx) => (
                    <div key={idx} className={`border rounded-lg p-6 text-center ${plan.popular ? 'border-blue-500 relative' : 'border-gray-200'}`}>
                        {plan.popular && (
                            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </span>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="text-3xl font-bold text-gray-900 mb-4">
                            {plan.price}<span className="text-sm text-gray-500">/month</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-500 mr-2" />
                                    <span className="text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-2 px-4 rounded-md transition-colors ${
                            plan.popular
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}>
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Pricing