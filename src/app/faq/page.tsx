'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Sri Anvaya calculate my annual Sradham date?',
      a: 'We support all traditional calendar traditions: Lunar (Chandramana / Telugu / Kannada / Marathi), Solar (Tamil / Malayalam), and North Indian calendars. Our software, backed by senior Panchanga scholars, matches your Pitru’s departure tithi, paksha, and masa to compute the precise date annually.',
    },
    {
      q: 'What is included in the 4-member ritual team?',
      a: 'Our Standard and Premium plans provide a complete 4-member team consisting of 1 Chief Vadhyar (Purohith), 2 learned Brahmin Swamigals (representing Vishwadevas and Pitrus), and 1 orthodox Madi cook for traditional prasadam preparation.',
    },
    {
      q: 'Do I need to pay Dakshina separately to the priests?',
      a: 'No. All Dakshina, Sambhavana, and travel allowances are fully covered within your Sri Anvaya subscription. There is strictly zero negotiation or awkward commercial discussion on the sacred day.',
    },
    {
      q: 'How does the 12% Provider Welfare Wallet work?',
      a: 'Sri Anvaya automatically allocates 12% of every event’s gross value to the assigned providers’ dedicated Welfare Wallets. At the end of each month, these funds are consolidated for healthcare insurance, children’s education, and old-age social security for traditional priests.',
    },
    {
      q: 'Can NRIs participate in the ritual virtually?',
      a: 'Yes. Our Premium plan includes dedicated high-definition video streaming setup so overseas family members can witness the Sankalpam and rituals in real time.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="pt-16 pb-20 bg-warmwhite border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600">
            Got Questions?
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-maroon-900 mt-3">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-charcoal-800/80 font-serif leading-relaxed">
            Everything you need to know about Sradham 360 subscription and operational procedures.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-warmwhite rounded-2xl border border-sand overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-5 text-left font-serif font-bold text-base text-maroon-900 flex items-center justify-between hover:bg-cream/40"
              >
                <span>{faq.q}</span>
                {openIdx === idx ? (
                  <ChevronUp className="w-5 h-5 text-gold-600 shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-charcoal-800/50 shrink-0 ml-4" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 pt-1 text-sm text-charcoal-800/80 leading-relaxed border-t border-sand/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
