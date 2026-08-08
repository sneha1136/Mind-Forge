'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Compass, ArrowLeft, Trash2, Calendar, MapPin, Users, DollarSign, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SavedTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkUserAndFetch();
  }, []);

  const checkUserAndFetch = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    let query = supabase.from('trips').select('*').order('created_at', { ascending: false });

    if (user) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Failed to fetch saved trips');
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/auth');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    const { error } = await supabase.from('trips').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete trip');
    } else {
      setTrips(trips.filter((t) => t.id !== id));
      toast.success('Trip deleted');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Generator
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-400" />
              <h1 className="text-xl font-bold text-white">Saved Itineraries</h1>
            </div>
            
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" /> Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                className="bg-indigo-600 hover:bg-indigo-500 text-xs text-white px-3 py-1.5 rounded-lg font-medium transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <p className="animate-pulse">Loading saved trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <p className="text-slate-400">No trips saved yet.</p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all"
            >
              Architect Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => {
              const data = trip.trip_data;
              return (
                <div
                  key={trip.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="text-xl font-bold text-indigo-400">{data?.tripTitle || trip.destination}</h2>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="bg-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-400" /> {trip.destination}
                      </span>
                      <span className="bg-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-400" /> {trip.days} Days
                      </span>
                      <span className="bg-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-indigo-400" /> {trip.budget}
                      </span>
                      <span className="bg-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Users className="w-3 h-3 text-indigo-400" /> {trip.companion}
                      </span>
                    </div>

                    {data?.itinerary?.[0] && (
                      <div className="bg-slate-800/40 p-3 rounded-lg text-xs space-y-1 mt-2 border border-slate-800">
                        <p className="font-semibold text-slate-200">Day 1: {data.itinerary[0].theme}</p>
                        <p className="text-slate-400 line-clamp-2">
                          {data.itinerary[0].activities?.[0]?.placeName} - {data.itinerary[0].activities?.[0]?.details}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                    Saved on: {new Date(trip.created_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}