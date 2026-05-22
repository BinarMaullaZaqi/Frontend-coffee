import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { categoryAPI, pembicaraAPI, eventAPI } from "../../../api/client";
import CategoryAdmin from './CategoryAdmin.tsx';
import PembicaraAdmin from "./PembicaraAdmin.tsx";
import EventAdmin from "./EventAdmin.tsx";

type Tab = "event" | "category" | "pembicara";

interface Summary {
  totalEvent: number;
  totalKategori: number;
  totalPembicara: number;
}

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("event");
  const [summary, setSummary] = useState<Summary>({
    totalEvent: 0,
    totalKategori: 0,
    totalPembicara: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const [evRes, catRes, pemRes] = await Promise.all([
        eventAPI.getAll(),
        categoryAPI.getAll(),
        pembicaraAPI.getAll(),
      ]);
      setSummary({
        totalEvent: evRes.data.total ?? evRes.data.data.length,
        totalKategori: catRes.data.total ?? catRes.data.data.length,
        totalPembicara: pemRes.data.total ?? pemRes.data.data.length,
      });
    } catch {
      // summary tetap 0 jika gagal
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "event", label: "Event", icon: "📅" },
    { id: "category", label: "Kategori", icon: "🏷️" },
    { id: "pembicara", label: "Pembicara", icon: "🎤" },
  ];

  const cards = [
    { label: "Total Event", value: summary.totalEvent, icon: "📅", color: "bg-amber-100 text-amber-800" },
    { label: "Total Kategori", value: summary.totalKategori, icon: "🏷️", color: "bg-green-100 text-green-800" },
    { label: "Total Pembicara", value: summary.totalPembicara, icon: "🎤", color: "bg-blue-100 text-blue-800" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-900 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">☕ Admin Panel — KopiEvent</h1>
            <p className="text-amber-300 text-sm">
              Halo, {user?.nama} · NIM {user?.nim}
            </p>
          </div>
          <span className="bg-amber-700 text-xs px-3 py-1 rounded-full font-medium">
            Administrator
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
              <p className="text-2xl">{c.icon}</p>
              <p className="text-3xl font-bold mt-1">{c.value}</p>
              <p className="text-sm font-medium mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-amber-800 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-amber-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "event" && <EventAdmin onMutate={fetchSummary} />}
          {activeTab === "category" && <CategoryAdmin onMutate={fetchSummary} />}
          {activeTab === "pembicara" && <PembicaraAdmin onMutate={fetchSummary} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;