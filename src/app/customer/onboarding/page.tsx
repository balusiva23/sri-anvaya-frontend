'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  ScrollText,
  Calendar,
  MapPin,
  Sliders,
  CreditCard,
  Check,
  Sparkles,
} from 'lucide-react';

export default function OnboardingWizardPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [personal, setPersonal] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    altPhone: '',
  });

  const [family, setFamily] = useState({
    gothram: 'Koundinya Gothram',
    kuladeivam: 'Sri Prasanna Venkatesa Perumal',
    nativePlace: 'Thanjavur, Tamil Nadu',
    members: [{ id: 'm1', fullName: user?.fullName || 'Kartha', relationship: 'Self / Kartha', phone: user?.phone || '' }],
  });

  const [pitruRecord, setPitruRecord] = useState({
    pitruName: 'Late Sri V. Subramania Sharma',
    relationship: 'Father',
    calendarType: 'Chandramana',
    masa: 'Bhadrapada',
    paksha: 'Krishna Paksha (Mahalaya)',
    tithi: 'Navami',
    nakshatra: 'Rohini',
    englishDate: '2026-09-24',
    annualDateNotes: 'Observed during Mahalaya Paksha Navami tithi.',
    notes: 'Requires traditional 4-member Vedic team.',
  });

  const [location, setLocation] = useState({
    venueType: 'HOME',
    line1: 'Flat 4B, Heritage Towers, 12th Cross Road',
    line2: 'Mylapore',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600004',
  });

  const [preferences, setPreferences] = useState<string[]>([
    'Smartha Sampradayam',
    'Strict Madi Cooking Required',
  ]);

  const [selectedPlan, setSelectedPlan] = useState('STANDARD');
  const [paymentProvider, setPaymentProvider] = useState('razorpay');
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  React.useEffect(() => {
    apiFetch('/plans')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAvailablePlans(data.filter((p: any) => p.isActive));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const stepsList = [
    { num: 1, title: 'Personal' },
    { num: 2, title: 'Family' },
    { num: 3, title: 'Pitru Records' },
    { num: 4, title: 'Calendar & Tithi' },
    { num: 5, title: 'Location' },
    { num: 6, title: 'Preferences' },
    { num: 7, title: 'Choose Plan' },
    { num: 8, title: 'Checkout' },
  ];

  const handleNextStep = async () => {
    if (step < 8) {
      setLoading(true);
      try {
        await apiFetch('/customers/onboarding', {
          method: 'PUT',
          body: JSON.stringify({
            step: step + 1,
            payload: {
              fullName: personal.fullName,
              phone: personal.phone,
              address: location,
              serviceCity: location.city,
              preferences,
              family,
              pitruRecord,
            },
          }),
        });
        setStep(step + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      // Final step: subscribe & pay
      setLoading(true);
      try {
        await apiFetch('/subscriptions/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            planCode: selectedPlan,
            paymentMethod: paymentProvider,
          }),
        });
        await refreshUser();
        router.push('/customer/dashboard');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Guided Sradham 360 Onboarding"
        subtitle="Complete your 8-step family lineage registration and service configuration."
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Stepper Progress Bar */}
        <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
              Profile Completion: {Math.round((step / 8) * 100)}%
            </span>
            <span className="text-xs font-semibold text-charcoal-800/60">
              Step {step} of 8: {stepsList[step - 1].title}
            </span>
          </div>

          <div className="w-full bg-sand/60 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-maroon-700 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-[10px] font-bold">
            {stepsList.map((s) => (
              <div
                key={s.num}
                className={`p-2 rounded-xl border transition-all ${
                  step === s.num
                    ? 'bg-maroon-700 text-white border-maroon-700'
                    : step > s.num
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-canvas text-charcoal-800/50 border-sand'
                }`}
              >
                <span>{s.num}. {s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="bg-warmwhite rounded-3xl p-8 border border-sand shadow-xl">
          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 1: Personal Information</h3>
              <p className="text-xs text-charcoal-800/70">Verify your primary contact and communications profile.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Primary Kartha Name</label>
                <input
                  type="text"
                  value={personal.fullName}
                  onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Mobile (WhatsApp Reminders)</label>
                  <input
                    type="tel"
                    value={personal.phone}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Alternative Phone / Landline</label>
                  <input
                    type="tel"
                    value={personal.altPhone}
                    onChange={(e) => setPersonal({ ...personal, altPhone: e.target.value })}
                    placeholder="+91 44 2499 1234"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Family */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 2: Family Heritage & Gothram</h3>
              <p className="text-xs text-charcoal-800/70">Required for accurate Sankalpam mantras during ceremonies.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Family Gothram</label>
                <input
                  type="text"
                  value={family.gothram}
                  onChange={(e) => setFamily({ ...family, gothram: e.target.value })}
                  placeholder="e.g. Koundinya, Haritha, Kashyapa, Bharadwaja"
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Kuladeivam / Ishta Devata</label>
                  <input
                    type="text"
                    value={family.kuladeivam}
                    onChange={(e) => setFamily({ ...family, kuladeivam: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Native Village / Kshetra</label>
                  <input
                    type="text"
                    value={family.nativePlace}
                    onChange={(e) => setFamily({ ...family, nativePlace: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pitru */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 3: Pitru Details</h3>
              <p className="text-xs text-charcoal-800/70">Enter your departed ancestor’s details for ritual invocation.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Pitru Name (Late Sri / Smt)</label>
                <input
                  type="text"
                  value={pitruRecord.pitruName}
                  onChange={(e) => setPitruRecord({ ...pitruRecord, pitruName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Relationship to Kartha</label>
                <select
                  value={pitruRecord.relationship}
                  onChange={(e) => setPitruRecord({ ...pitruRecord, relationship: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                >
                  <option value="Father">Father (Pithru)</option>
                  <option value="Mother">Mother (Mathru)</option>
                  <option value="Grandfather">Paternal Grandfather (Pithaamaha)</option>
                  <option value="Grandmother">Paternal Grandmother (Pithaamahi)</option>
                  <option value="Maternal Grandfather">Maternal Grandfather (Maathaamaha)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Calendar & Tithi */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 4: Important Dates & Vedic Tithi</h3>
              <p className="text-xs text-charcoal-800/70">Our Panchanga engine will track and compute this date annually.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Calendar Tradition</label>
                  <select
                    value={pitruRecord.calendarType}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, calendarType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  >
                    <option value="Chandramana">Lunar (Chandramana - Telugu/Kannada/Marathi)</option>
                    <option value="Solar">Solar (Sauramana / Tamil / Malayalam)</option>
                    <option value="Gregorian">English / Gregorian Date Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Masa / Month</label>
                  <input
                    type="text"
                    value={pitruRecord.masa}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, masa: e.target.value })}
                    placeholder="e.g. Bhadrapada / Purattasi"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Paksha</label>
                  <select
                    value={pitruRecord.paksha}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, paksha: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  >
                    <option value="Krishna Paksha (Mahalaya)">Krishna Paksha (Dark Fortnight)</option>
                    <option value="Shukla Paksha">Shukla Paksha (Bright Fortnight)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Tithi</label>
                  <input
                    type="text"
                    value={pitruRecord.tithi}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, tithi: e.target.value })}
                    placeholder="e.g. Navami, Ekadashi, Amavasya"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Calculated 2026 Date</label>
                  <input
                    type="date"
                    value={pitruRecord.englishDate}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, englishDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Location */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 5: Service Location & Venue</h3>
              <p className="text-xs text-charcoal-800/70">Address where the 4-member ritual team will arrive on ceremony morning.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={location.line1}
                  onChange={(e) => setLocation({ ...location, line1: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Area / Locality</label>
                  <input
                    type="text"
                    value={location.line2}
                    onChange={(e) => setLocation({ ...location, line2: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">City</label>
                  <input
                    type="text"
                    value={location.city}
                    onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={location.pincode}
                    onChange={(e) => setLocation({ ...location, pincode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Preferences */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 6: Sampradayam & Dietary Preferences</h3>
              <p className="text-xs text-charcoal-800/70">Custom rules for Vadhyar alignment and kitchen madi standards.</p>

              <div className="space-y-2">
                {[
                  'Smartha (Iyer / Vaidiki / Telugu Smartha)',
                  'Vadakalai Srivaishnava Iyengar',
                  'Thenkalai Srivaishnava Iyengar',
                  'Madhwa / Shivalli Brahmin',
                  'Strict Madi Kitchen Preparation',
                  'Ghee from Native Desi Cows',
                ].map((pref) => {
                  const selected = preferences.includes(pref);
                  return (
                    <button
                      type="button"
                      key={pref}
                      onClick={() => {
                        if (selected) {
                          setPreferences(preferences.filter((p) => p !== pref));
                        } else {
                          setPreferences([...preferences, pref]);
                        }
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-maroon-50 border-maroon-700 text-maroon-900'
                          : 'bg-canvas border-sand text-charcoal-800'
                      }`}
                    >
                      <span>{pref}</span>
                      {selected && <Check className="w-4 h-4 text-maroon-700" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 7: Choose Plan */}
          {step === 7 && (
            <div className="space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 7: Choose Your Sradham 360 Plan</h3>
              <p className="text-xs text-charcoal-800/70">Spread ceremonial expenses over peaceful monthly installments.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(availablePlans.length > 0
                  ? availablePlans
                  : [
                      { code: 'ESSENTIAL', name: 'Essential Plan', monthlyPrice: 1000, description: 'Purohith & Tithi Management', isRecommended: false },
                      { code: 'STANDARD', name: 'Standard 360', monthlyPrice: 1500, description: 'Full 4-Member Team & Samagri Kit (Recommended)', isRecommended: true },
                      { code: 'PREMIUM', name: 'Premium Heritage', monthlyPrice: 2000, description: 'White-glove concierge & live stream', isRecommended: false },
                    ]
                ).map((p) => (
                  <button
                    type="button"
                    key={p.code}
                    onClick={() => setSelectedPlan(p.code)}
                    className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      selectedPlan === p.code
                        ? 'border-2 border-gold-500 bg-gold-50/50 shadow-md'
                        : 'border-sand bg-canvas'
                    }`}
                  >
                    {p.isRecommended && (
                      <span className="absolute -top-2.5 right-3 bg-gold-500 text-maroon-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Recommended
                      </span>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-maroon-900 font-serif">{p.name}</h4>
                      <p className="text-2xl font-extrabold text-charcoal-900 mt-2">₹{p.monthlyPrice?.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] text-charcoal-800/60">/ month</span>
                      <p className="text-xs text-charcoal-800/70 mt-2">{p.description}</p>
                    </div>
                    {selectedPlan === p.code && (
                      <div className="mt-4 flex items-center space-x-1 text-xs font-bold text-maroon-800">
                        <Check className="w-4 h-4" />
                        <span>Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Checkout */}
          {step === 8 && (
            <div className="space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 8: Payment Confirmation</h3>
              <p className="text-xs text-charcoal-800/70">Activate your recurring subscription with instant verification.</p>

              <div className="p-6 rounded-2xl bg-canvas border border-sand space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-800/70">Selected Plan:</span>
                  <span className="font-bold text-charcoal-900">{selectedPlan} Sradham 360</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-800/70">Monthly Subscription:</span>
                  <span className="font-bold text-charcoal-900">
                    ₹{selectedPlan === 'ESSENTIAL' ? 1000 : selectedPlan === 'PREMIUM' ? 2000 : 1500}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-800/70">Annual Sradham Date:</span>
                  <span className="font-bold text-maroon-900">{pitruRecord.englishDate}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-sand">
                  <span className="font-bold text-charcoal-900">Total Payable Today:</span>
                  <span className="text-xl font-extrabold text-maroon-900">
                    ₹{selectedPlan === 'ESSENTIAL' ? 1000 : selectedPlan === 'PREMIUM' ? 2000 : 1500}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-2">Select Gateway</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('razorpay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                      paymentProvider === 'razorpay'
                        ? 'bg-maroon-50 border-maroon-700 text-maroon-900'
                        : 'bg-canvas border-sand'
                    }`}
                  >
                    <span>Razorpay (UPI / NetBanking / Cards)</span>
                    {paymentProvider === 'razorpay' && <Check className="w-4 h-4 text-maroon-700" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('stripe')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                      paymentProvider === 'stripe'
                        ? 'bg-maroon-50 border-maroon-700 text-maroon-900'
                        : 'bg-canvas border-sand'
                    }`}
                  >
                    <span>Stripe (International / NRI Cards)</span>
                    {paymentProvider === 'stripe' && <Check className="w-4 h-4 text-maroon-700" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-sand flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-sand bg-canvas hover:bg-sand text-charcoal-900 font-bold text-xs flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            <button
              type="button"
              disabled={loading}
              onClick={handleNextStep}
              className="px-7 py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <span>
                {loading ? 'Saving...' : step === 8 ? 'Confirm & Activate Sradham 360' : 'Save & Continue'}
              </span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
