import { Event, EventStatus } from "../types";

interface Props {
  event: Event;
}

const statusLabel: Record<EventStatus, string> = {
  UPCOMING:  "Akan Datang",
  ONGOING:   "Berlangsung",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const statusColor: Record<EventStatus, string> = {
  UPCOMING:  "bg-blue-100 text-blue-700",
  ONGOING:   "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-100 text-red-600",
};

const EventCard = ({ event }: Props) => {
  const tanggal = new Date(event.tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-44 bg-amber-100 flex items-center justify-center text-5xl relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.judul}
            className="w-full h-full object-cover"
          />
        ) : (
          "☕"
        )}
        <span
          className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full ${statusColor[event.status]}`}
        >
          {statusLabel[event.status]}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">
          {event.category.nama}
        </p>
        <h3 className="font-bold text-gray-800 mt-1 leading-snug line-clamp-2">
          {event.judul}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {event.deskripsi}
        </p>

        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <p>📅 {tanggal}</p>
          <p>📍 {event.lokasi}</p>
          <p>🎤 {event.pembicara.nama}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-amber-800">
            {event.harga === 0
              ? "GRATIS"
              : `Rp ${event.harga.toLocaleString("id-ID")}`}
          </span>
          <span className="text-xs text-gray-400">{event.kapasitas} kursi</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;