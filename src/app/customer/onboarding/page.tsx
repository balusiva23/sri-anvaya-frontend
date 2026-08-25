'use client';

import React, { useState, useEffect } from 'react';
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

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

  // Load existing profile and plans on mount
  useEffect(() => {
    const initData = async () => {
      try {
        setInitialLoading(true);
        const [profileRes, plansRes] = await Promise.all([
          apiFetch('/customers/profile').catch(() => null),
          apiFetch('/plans').catch(() => []),
        ]);

        if (Array.isArray(plansRes) && plansRes.length > 0) {
          setAvailablePlans(plansRes.filter((p: any) => p.isActive));
        }

        if (profileRes) {
          const cust = profileRes.customer;
          const fam = profileRes.family;
          const pitru = profileRes.pitruRecords?.[0];

          if (cust) {
            setPersonal({
              fullName: cust.fullName || user?.fullName || '',
              phone: cust.phone || user?.phone || '',
              altPhone: cust.altPhone || '',
            });

            if (cust.address) {
              setLocation({
                venueType: cust.address.venueType || 'HOME',
                line1: cust.address.line1 || '',
                line2: cust.address.line2 || '',
                city: cust.address.city || cust.serviceCity || 'Chennai',
                state: cust.address.state || 'Tamil Nadu',
                pincode: cust.address.pincode || '',
              });
            }

            if (cust.preferences && Array.isArray(cust.preferences) && cust.preferences.length > 0) {
              setPreferences(cust.preferences);
            }

            if (cust.isProfileComplete) {
              setIsComplete(true);
              setStep(8);
            } else if (cust.onboardingStep) {
              setStep(cust.onboardingStep);
            }
          }

          if (fam) {
            setFamily({
              gothram: fam.gothram || 'Koundinya Gothram',
              kuladeivam: fam.kuladeivam || '',
              nativePlace: fam.nativePlace || '',
              members: fam.members?.length ? fam.members : [{ id: 'm1', fullName: cust?.fullName || 'Kartha', relationship: 'Self / Kartha', phone: cust?.phone || '' }],
            });
          }

          if (pitru) {
            setPitruRecord({
              pitruName: pitru.pitruName || '',
              relationship: pitru.relationship || 'Father',
              calendarType: pitru.calendarType || 'Chandramana',
              masa: pitru.masa || 'Bhadrapada',
              paksha: pitru.paksha || 'Krishna Paksha (Mahalaya)',
              tithi: pitru.tithi || 'Navami',
              nakshatra: pitru.nakshatra || 'Rohini',
              englishDate: pitru.englishDate ? pitru.englishDate.split('T')[0] : '2026-09-24',
              annualDateNotes: pitru.annualDateNotes || '',
              notes: pitru.notes || '',
            });
          }
        }
      } catch (err) {
        console.error('Error loading onboarding profile:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    initData();
  }, [user]);

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

  const handleJumpToStep = (targetStep: number) => {
    setStep(targetStep);
  };

  const completionPercentage = isComplete ? 100 : Math.round((step / 8) * 100);

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Guided Sradham 360 Onboarding"
        subtitle="Complete your 8-step family lineage registration and service configuration."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Stepper Progress Bar */}
        <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
              Profile Completion: {completionPercentage}%
            </span>
            <span className="text-xs font-semibold text-charcoal-800/60">
              Step {step} of 8: {stepsList[step - 1]?.title}
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full h-2 rounded-full bg-sand/60 overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-maroon-700 via-gold-500 to-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Stepper clickable pill buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {stepsList.map((s) => (
              <button
                type="button"
                key={s.num}
                onClick={() => handleJumpToStep(s.num)}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                  step === s.num
                    ? 'bg-maroon-800 text-white shadow-sm ring-2 ring-gold-500/50'
                    : step > s.num || isComplete
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-canvas text-charcoal-800/60 border border-sand hover:bg-cream/40'
                }`}
              >
                <span className="block truncate">
                  {s.num}. {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-xl">
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
                  placeholder="e.g. Sivakumar Sharma"
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
                    placeholder="e.g. 9786638378"
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
                    placeholder="e.g. Sri Prasanna Venkatesa Perumal"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Native Village / Kshetra</label>
                  <input
                    type="text"
                    value={family.nativePlace}
                    onChange={(e) => setFamily({ ...family, nativePlace: e.target.value })}
                    placeholder="e.g. Thanjavur, Tamil Nadu"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pitru Records */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 3: Sacred Pitru Registry</h3>
              <p className="text-xs text-charcoal-800/70">Primary ancestral record for upcoming Sradham ceremonies.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Pitru Full Name</label>
                  <input
                    type="text"
                    value={pitruRecord.pitruName}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, pitruName: e.target.value })}
                    placeholder="Late Sri V. Subramania Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Relationship</label>
                  <select
                    value={pitruRecord.relationship}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, relationship: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  >
                    <option>Father (Pitha)</option>
                    <option>Mother (Matha)</option>
                    <option>Paternal Grandfather (Pitha Maha)</option>
                    <option>Paternal Grandmother (Pitha Mahi)</option>
                    <option>Maternal Grandfather (Matha Maha)</option>
                    <option>Maternal Grandmother (Matha Mahi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Departure Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={pitruRecord.notes}
                  onChange={(e) => setPitruRecord({ ...pitruRecord, notes: e.target.value })}
                  placeholder="Special prayers, preferred holy grains, or family custom notes..."
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs"
                />
              </div>
            </div>
          )}

          {/* Step 4: Calendar & Tithi */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 4: Vedic Calendar & Tithi Calculation</h3>
              <p className="text-xs text-charcoal-800/70">Lunar and solar parameters for accurate Panchangam matching.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Tradition System</label>
                  <select
                    value={pitruRecord.calendarType}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, calendarType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  >
                    <option value="Chandramana">Chandramana (Lunar)</option>
                    <option value="Sauramana">Sauramana (Solar - Tamil/Malayalam)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Masa / Month</label>
                  <input
                    type="text"
                    value={pitruRecord.masa}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, masa: e.target.value })}
                    placeholder="e.g. Bhadrapada / Purattasi"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Paksha</label>
                  <input
                    type="text"
                    value={pitruRecord.paksha}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, paksha: e.target.value })}
                    placeholder="e.g. Krishna Paksha (Mahalaya)"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Tithi</label>
                  <input
                    type="text"
                    value={pitruRecord.tithi}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, tithi: e.target.value })}
                    placeholder="e.g. Navami / Ekadasi / Amavasya"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Nakshatra</label>
                  <input
                    type="text"
                    value={pitruRecord.nakshatra}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, nakshatra: e.target.value })}
                    placeholder="e.g. Rohini / Swati / Bharani"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Target English Date</label>
                  <input
                    type="date"
                    value={pitruRecord.englishDate}
                    onChange={(e) => setPitruRecord({ ...pitruRecord, englishDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Location */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 5: Ceremony Venue & Coordinates</h3>
              <p className="text-xs text-charcoal-800/70">Where the 4-member Vedic ritual team should arrive on the day of Sradham.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={location.line1}
                  onChange={(e) => setLocation({ ...location, line1: e.target.value })}
                  placeholder="Flat 4B, Heritage Towers, 12th Cross Road"
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Area / Landmark</label>
                  <input
                    type="text"
                    value={location.line2}
                    onChange={(e) => setLocation({ ...location, line2: e.target.value })}
                    placeholder="Mylapore"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">City</label>
                  <input
                    type="text"
                    value={location.city}
                    onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    placeholder="Chennai"
                    className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={location.pincode}
                    onChange={(e) => setLocation({ ...location, pincode: e.target.value })}
                    placeholder="600004"
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
                  'Smartha Sampradayam (Iyer / Vaidiki / Telugu Smartha)',
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
              <h3 className="font-cinzel text-xl font-bold text-maroon-900">Step 8: Payment & Activation</h3>
              <p className="text-xs text-charcoal-800/70">Activate your recurring Sradham 360 subscription.</p>

              <div className="p-4 rounded-2xl bg-cream border border-sand space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-charcoal-900">Selected Package:</span>
                  <span className="font-semibold text-maroon-900">{selectedPlan} Sradham 360</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-charcoal-900">Monthly Contribution:</span>
                  <span className="font-bold text-charcoal-900">₹1,500 / month</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-sand/60 pt-2">
                  <span className="font-bold text-charcoal-900">12% Welfare Protected:</span>
                  <span className="text-emerald-700 font-bold">₹180 / month to Provider Fund</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase text-charcoal-800/70">Payment Gateway</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('razorpay')}
                    className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                      paymentProvider === 'razorpay'
                        ? 'border-2 border-maroon-700 bg-maroon-50 text-maroon-900'
                        : 'border-sand bg-canvas text-charcoal-800'
                    }`}
                  >
                    UPI / NetBanking / Cards (Razorpay)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('stripe')}
                    className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                      paymentProvider === 'stripe'
                        ? 'border-2 border-maroon-700 bg-maroon-50 text-maroon-900'
                        : 'border-sand bg-canvas text-charcoal-800'
                    }`}
                  >
                    International Cards (Stripe)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-sand mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl border border-sand bg-canvas hover:bg-cream text-charcoal-800 font-semibold text-xs transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextStep}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Saving...'
                  : step === 8
                  ? 'Activate Sradham 360 Plan'
                  : 'Save & Continue'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
