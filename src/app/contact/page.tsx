'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="pt-16 pb-20 bg-warmwhite border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600">
            Dedicated Family Support
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-maroon-900 mt-3">
            Contact Sri Anvaya
          </h1>
          <p className="mt-4 text-base sm:text-lg text-charcoal-800/80 font-serif leading-relaxed">
            Speak directly with a dedicated Relationship Manager for customized family requirements.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info Card */}
          <div className="bg-warmwhite rounded-3xl p-8 border border-sand shadow-sm space-y-8">
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-maroon-900">National Headquarters</h3>
              <p className="mt-2 text-sm text-charcoal-800/70 font-serif">
                Serving Chennai, Bengaluru, Hyderabad, Mumbai, Delhi-NCR, and Overseas NRIs.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Operations Centre</h4>
                  <p className="text-xs text-charcoal-800/70 mt-0.5">Heritage Arcade, North Mada Street, Mylapore, Chennai, TN 600004</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Direct Support Hotline</h4>
                  <p className="text-xs text-charcoal-800/70 mt-0.5">+91 98840 12345 / +91 44 2499 5500 (8 AM - 8 PM IST)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Email Inquiries</h4>
                  <p className="text-xs text-charcoal-800/70 mt-0.5">care@srianvaya.com / support@srianvaya.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-warmwhite rounded-3xl p-8 border border-sand shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-maroon-900">Message Received</h3>
                <p className="text-xs text-charcoal-800/70 max-w-xs mx-auto">
                  Namaskaram. Our senior Relationship Manager will call you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sundaram Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98840 12345"
                      className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sundaram@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                    City & Tradition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai - Smartha / Vadakalai / Madhwa"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                    Message / Special Requirement
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How may our Vedic operations team assist you?"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
