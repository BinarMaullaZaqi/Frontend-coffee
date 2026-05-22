import { useEffect, useState } from "react";
import { eventAPI } from "../../../api/client";
// ✅ FIX: Wajib pakai import type karena verbatimModuleSyntax aktif
import type { Event } from "../../../types";
import EventCard from "../../../components/EventCard";

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventAPI.getAll();
      setEvents(res.data.data || []);
    } catch {
      setError("Gagal memuat data event. Pastikan server backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="bg-amber-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-4xl font-extrabold mb-3">Event Kopi Indonesia</h1>
          <p className="text-amber-200 text-base max-w-xl mx-auto">
            Temukan workshop barista, coffee cupping, kompetisi latte art, dan berbagai event kopi seru lainnya.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-900">Semua Event</h2>
          {!loading && !error && (
            <span className="text-sm text-gray-500">{events.length} event tersedia</span>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* ✅ FIX: Angka udah nempel manis sebelum .map */}
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">☕</p>
            <p className="text-gray-400 text-sm">
              Belum ada event. Tambahkan lewat Admin Panel!
            </p>
          </div>
        )}

        {/* Success Grid State */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;