import { useEffect, useState } from "react";
import { categoryAPI } from "../../../api/client";
// ✅ HANYA MENGIMPOR YANG DIPAKAI: Menyisakan CategoryEvent
import type { CategoryEvent } from "../../../types";

interface Props {
  onMutate: () => void;
}

// ✅ FIX: Kita langsung buat inline interface untuk state Form supaya tidak bergantung pada file types luar
interface CategoryFormState {
  nama: string;
  deskripsi: string;
}

const emptyForm: CategoryFormState = { nama: "", deskripsi: "" };

const CategoryAdmin = ({ onMutate }: Props) => {
  const [list, setList] = useState<CategoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      setList(res.data.data || []);
    } catch (err) {
      showMsg("err", "Gagal mengambil data kategori.");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) return;

    setSubmitting(true);
    try {
      if (editId) {
        await categoryAPI.update(editId, form);
        showMsg("ok", "Kategori berhasil diperbarui.");
      } else {
        await categoryAPI.create(form);
        showMsg("ok", "Kategori berhasil ditambahkan.");
      }
      setForm(emptyForm);
      setEditId(null);
      fetchList();
      onMutate();
    } catch (err: any) {
      showMsg("err", err.response?.data?.error || "Gagal menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: CategoryEvent) => {
    setEditId(item.id);
    setForm({ nama: item.nama, deskripsi: item.deskripsi || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus kategori "${nama}"? Semua event dengan kategori ini juga akan terpengaruh.`)) return;
    try {
      await categoryAPI.delete(id);
      showMsg("ok", "Kategori berhasil dihapus.");
      fetchList();
      onMutate();
    } catch (err: any) {
      showMsg("err", err.response?.data?.error || "Gagal menghapus.");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  return (
    <div className="space-y-5">
      {/* Form Tambah/Edit */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-800 mb-4">
          {editId ? "Edit Kategori" : "Tambah Kategori"}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kategori <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Contoh: Workshop"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <input
                type="text"
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat..."
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
              {submitting ? "Menyimpan..." : editId ? "Update" : "Tambah"}
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

      {/* Tabel List Kategori */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-700">
            Daftar Kategori ({list.length})
          </h3>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400 text-sm">Memuat...</div>
        ) : list.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">
            Belum ada kategori.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">ID</th>
                  <th className="text-left px-5 py-3 font-semibold">Nama</th>
                  <th className="text-left px-5 py-3 font-semibold">Deskripsi</th>
                  <th className="text-left px-5 py-3 font-semibold">Jml Event</th>
                  <th className="text-left px-5 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-5 py-3 text-gray-400">#{item.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{item.nama}</td>
                    <td className="px-5 py-3 text-gray-500">{item.deskripsi || "—"}</td>
                    <td className="px-5 py-3">
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {item._count?.events ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
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

export default CategoryAdmin;