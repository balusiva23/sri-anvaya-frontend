import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 text-sand border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-maroon-800 text-gold-400 flex items-center justify-center font-cinzel font-bold text-lg border border-gold-500/30">
                ॐ
              </div>
              <span className="font-cinzel font-bold text-xl text-warmwhite tracking-wider">
                SRI ANVAYA
              </span>
            </div>
            <p className="text-sm text-sand/80 leading-relaxed font-serif italic">
              &quot;Honouring Roots. Enriching Generations.&quot;
            </p>
            <p className="text-xs text-sand/60 leading-relaxed">
              Sri Anvaya is a technology-enabled traditional service management ecosystem combining SaaS discipline with authentic Vedic integrity.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-900/30 border border-gold-600/30 text-gold-300 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>12% Provider Welfare Committed</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-cinzel text-sm font-semibold text-warmwhite tracking-wider uppercase mb-4">
              Flagship Services
            </h4>
            <ul className="space-y-2.5 text-sm text-sand/70">
              <li>
                <Link href="/sradham-360" className="hover:text-gold-300 transition-colors">
                  Sradham 360 (Annual Care)
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:text-gold-300 transition-colors">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-gold-300 transition-colors">
                  Annual 4-Member Ritual Team
                </Link>
              </li>
              <li>
                <Link href="/sradham-360#samagri" className="hover:text-gold-300 transition-colors">
                  Samagri & Pure Ingredients
                </Link>
              </li>
              <li>
                <Link href="/sradham-360#welfare" className="hover:text-gold-300 transition-colors">
                  Provider Welfare & Dignity
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Portals */}
          <div>
            <h4 className="font-cinzel text-sm font-semibold text-warmwhite tracking-wider uppercase mb-4">
              Portals & Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-sand/70">
              <li>
                <Link href="/login" className="hover:text-gold-300 transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gold-300 transition-colors">
                  Vedic Provider Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gold-300 transition-colors">
                  Admin & Operations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  About Sri Anvaya
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Operations */}
          <div>
            <h4 className="font-cinzel text-sm font-semibold text-warmwhite tracking-wider uppercase mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-sand/70">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span>Mylapore / Bengaluru / Hyderabad (Expanding Pan-India & NRI Services)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 98840 12345 / +91 44 2499 5500</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>support@srianvaya.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-800 flex flex-col md:flex-row items-center justify-between text-xs text-sand/50 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Sri Anvaya Technologies Private Limited. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-gold-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold-300">Terms of Service</Link>
            <Link href="/security" className="hover:text-gold-300">Data Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
