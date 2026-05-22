import { useEffect, useState } from "react";
import { eventAPI, categoryAPI, pembicaraAPI } from "../../../api/client";
// Kita ganti 'Event' menjadi 'CoffeeEvent' pake kata 'as' biar gak bentrok sama internal DOM browser
import type { Event as CoffeeEvent, EventStatus, CategoryEvent, Pembicara, EventFormData } from "../../../types";

interface Props {
  onMutate: () => void;
}

const emptyForm: EventFormData = {
  judul: "",
  deskripsi: "",
  tanggal: "",
  lokasi: "",
  harga: "0",
  kapasitas: "50",
  imageUrl: "",
  status: "UPCOMING",
  categoryId: "",
  pembicaraId: "",
};

const statusOptions: EventStatus[] = ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"];

const EventAdmin = ({ onMutate }: Props) => {
  // ✅ AMAN: Sekarang menggunakan CoffeeEvent[], bukan Event[] browser lagi
  const [list, setList] = useState<CoffeeEvent[]>([]);
  const [categories, setCategories] = useState<CategoryEvent[]>([]);
  const [pembicara, setPembicara] = useState<Pembicara[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<EventFormData>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [evRes, catRes, pemRes] = await Promise.all([
        eventAPI.getAll(),
        categoryAPI.getAll(),
        pembicaraAPI.getAll(),
      ]);
      setList(evRes.data.data);
      setCategories(catRes.data.data);
      setPembicara(pemRes.data.data);
    } catch (err) {
      showMsg("err", "Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.pembicaraId) {
      showMsg("err", "Pilih kategori dan pembicara terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        await eventAPI.update(editId, form);
        showMsg("ok", "Event berhasil diperbarui.");
      } else {
        await eventAPI.create(form);
        showMsg("ok", "Event berhasil ditambahkan.");
      }
      setForm(emptyForm);
      setEditId(null);
      fetchAll();
      onMutate();
    } catch (err: any) {
      showMsg("err", err.response?.data?.error || "Gagal menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ AMAN: Parameter diganti menjadi CoffeeEvent
  const handleEdit = (item: CoffeeEvent) => {
    setEditId(item.id);
    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi,
      tanggal: new Date(item.tanggal).toISOString().slice(0, 16),
      lokasi: item.lokasi,
      harga: String(item.harga),
      kapasitas: String(item.kapasitas),
      imageUrl: item.imageUrl || "",
      status: item.status,
      categoryId: String(item.categoryId),
      pembicaraId: String(item.pembicaraId),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number, judul: string) => {
    if (!confirm(`Hapus event "${judul}"?`)) return;
    try {
      await eventAPI.delete(id);
      showMsg("ok", "Event berhasil dihapus.");
      fetchAll();
      onMutate();
    } catch (err: any) {
      showMsg("err", err.response?.data?.error || "Gagal menghapus.");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const statusColor: Record<EventStatus, string> = {
    UPCOMING:  "bg-blue-100 text-blue-700",
    ONGOING:   "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-500",
    CANCELLED: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-800 mb-4">
          {editId ? "Edit Event" : "Tambah Event"}
        </h2>

        {msg && (
          <div
            className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
              msg.type === "ok"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Event <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleChange}
                placeholder="Contoh: Workshop Barista Championship 2025"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                placeholder="Ceritakan detail eventnya..."
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal & Waktu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                placeholder="Contoh: Aula Kampus, Jakarta"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pembicara <span className="text-red-500">*</span>
              </label>
              <select
                name="pembicaraId"
                value={form.pembicaraId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="">-- Pilih Pembicara --</option>
                {pembicara.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.nama} — {p.spesialisasi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (Rp)
              </label>
              <input
                type="number"
                name="harga"
                value={form.harga}
                onChange={handleChange}
                min="0"
                placeholder="0 = Gratis"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapasitas (orang)
              </label>
              <input
                type="number"
                name="kapasitas"
                value={form.kapasitas}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Gambar
              </label>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-amber-800 hover:bg-amber-700 disabled:bg-amber-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {submitting ? "Menyimpan..." : editId ? "Update Event" : "Tambah Event"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Daftar Event ({list.length})</h3>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400 text-sm">Memuat...</div>
        ) : list.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">
            Belum ada event.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Judul</th>
                  <th className="text-left px-5 py-3 font-semibold">Kategori</th>
                  <th className="text-left px-5 py-3 font-semibold">Pembicara</th>
                  <th className="text-left px-5 py-3 font-semibold">Tanggal</th>
                  <th className="text-left px-5 py-3 font-semibold">Harga</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* ✅ AMAN: Di-looping menggunakan CoffeeEvent */}
                {list.map((item: CoffeeEvent) => (
                  <tr key={item.id} className="hover:bg-amber-50">
                    <td className="px-5 py-3 font-medium text-gray-800 max-w-52 truncate">
                      {item.judul}
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {item.category?.nama || "Tanpa Kategori"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.pembicara?.nama || "Tanpa Pembicara"}
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {Number(item.harga) === 0 ? (
                        <span className="text-green-600 font-semibold">Gratis</span>
                      ) : (
                        `Rp ${Number(item.harga).toLocaleString("id-ID")}`
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          statusColor[item.status as EventStatus] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.judul)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-xs font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAdmin;