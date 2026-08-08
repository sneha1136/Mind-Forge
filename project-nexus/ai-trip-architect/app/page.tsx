'use client';

import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Loader2,
  Bookmark,
  ExternalLink,
  Hotel,
  Sparkles,
  Printer,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function Home() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [budget, setBudget] = useState('Moderate');
  const [companion, setCompanion] = useState('Friends');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tripData, setTripData] = useState<any>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const handleGenerateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }

    setLoading(true);
    setTripData(null);
    const toastId = toast.loading(`Architecting itinerary for ${destination}...`);

    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, budget, companion }),
      });

      const data = await response.json();
      if (response.ok) {
        setTripData(data);
        toast.success('Itinerary generated successfully!', { id: toastId });
      } else {
        toast.error(data.error || 'Failed to generate trip', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!tripData) return;

    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/save-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: null,
          destination,
          days,
          budget,
          companion,
          tripData,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Trip saved to Supabase dashboard!');
      } else {
        toast.error('Error saving trip: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save trip.');
    } finally {
      setSaving(false);
    }
  };

  const getMapsUrl = (placeName: string, dest: string) => {
    const query = encodeURIComponent(`${placeName}, ${dest}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6 no-print">
          <div className="flex items-center gap-2 text-indigo-400">
            <Compass className="w-8 h-8 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              AI Trip Architect
            </h1>
          </div>
          <Link
            href="/saved-trips"
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4 text-indigo-400" /> View Saved Trips
          </Link>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerateTrip} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" /> Destination
              </label>
              <input
                type="text"
                placeholder="e.g. Goa, Tokyo, Paris"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" /> Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-400" /> Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Budget">Budget Friendly</option>
                <option value="Moderate">Moderate</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Traveling With
              </label>
              <select
                value={companion}
                onChange={(e) => setCompanion(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Solo">Solo</option>
                <option value="Couple">Couple</option>
                <option value="Friends">Friends</option>
                <option value="Family">Family</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Architecting Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Architect My Trip
              </>
            )}
          </button>
        </form>

        {/* Skeleton Loader during Generation */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl" />
            <div className="space-y-4">
              <div className="h-6 w-32 bg-slate-800 rounded" />
              <div className="h-40 bg-slate-900 border border-slate-800 rounded-xl" />
              <div className="h-40 bg-slate-900 border border-slate-800 rounded-xl" />
            </div>
          </div>
        )}

        {/* Generated Output */}
        {tripData && !loading && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <div>
                <h2 className="text-2xl font-bold text-indigo-400">{tripData.tripTitle}</h2>
                <p className="text-xs text-slate-400 mt-1">Generated for {destination} • {days} Days</p>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-indigo-400" /> Print / PDF
                </button>

                <button
                  onClick={handleSaveTrip}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" /> Save Trip
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Daily Itinerary</h3>
              {tripData.itinerary?.map((day: any) => (
                <div key={day.day} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-base font-semibold text-slate-200">
                    Day {day.day}: <span className="text-indigo-400">{day.theme}</span>
                  </h4>
                  <div className="grid gap-3">
                    {day.activities?.map((act: any, idx: number) => (
                      <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-indigo-400 font-bold uppercase">{act.time}</span>
                            <a
                              href={getMapsUrl(act.placeName, destination)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-100 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                            >
                              {act.placeName}
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          </div>
                          <p className="text-xs text-slate-400">{act.details}</p>
                        </div>

                        {act.ticketPrice && (
                          <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-1 rounded-md self-start md:self-center whitespace-nowrap">
                            {act.ticketPrice}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Hotels */}
            {tripData.hotelRecommendations?.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-indigo-400" /> Recommended Hotels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tripData.hotelRecommendations.map((hotel: any, idx: number) => (
                    <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-lg space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <a
                          href={getMapsUrl(hotel.hotelName, destination)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition-colors text-sm"
                        >
                          {hotel.hotelName}
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                        <p className="text-xs text-slate-400">{hotel.address}</p>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-300 pt-2 border-t border-slate-700/40">
                        <span>💰 {hotel.pricePerNight}</span>
                        <span>⭐ {hotel.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}