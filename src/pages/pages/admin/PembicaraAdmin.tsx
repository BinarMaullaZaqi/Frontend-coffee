import { useEffect, useState } from "react";
import { pembicaraAPI } from "../../../api/client";
import type { Pembicara, PembicaraFormData } from "../../../types";

interface Props {
  onMutate: () => void;
}

const emptyForm: PembicaraFormData = {
  nama: "",
  spesialisasi: "",
  instansi: "",
  email: "",
  bio: "",
  foto: "",
};

const PembicaraAdmin = ({ onMutate }: Props) => {
  const [list, setList] = useState<Pembicara[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PembicaraFormData>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await pembicaraAPI.getAll();
      setList(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await pembicaraAPI.update(editId, form);
        showMsg("ok", "Data pembicara berhasil diperbarui.");
      } else {
        await pembicaraAPI.create(form);
        showMsg("ok", "Pembicara berhasil ditambahkan.");
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

  const handleEdit = (item: Pembicara) => {
    setEditId(item.id);
    setForm({
      nama: item.nama,
      spesialisasi: item.spesialisasi,
      instansi: item.instansi,
      email: item.email,
      bio: item.bio || "",
      foto: item.foto || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus pembicara "${nama}"?`)) return;
    try {
      await pembicaraAPI.delete(id);
      showMsg("ok", "Pembicara berhasil dihapus.");
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

  const fields: {
    name: keyof PembicaraFormData;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: string;
  }[] = [
    { name: "nama", label: "Nama Lengkap", placeholder: "John Doe", required: true },
    { name: "spesialisasi", label: "Spesialisasi", placeholder: "Specialty Coffee Barista", required: true },
    { name: "instansi", label: "Instansi / Perusahaan", placeholder: "Kopi Nusantara Co.", required: true },
    { name: "email", label: "Email", placeholder: "john@kopi.com", required: true, type: "email" },
    { name: "foto", label: "URL Foto", placeholder: "https://..." },
    { name: "bio", label: "Bio Singkat", placeholder: "Barista berpengalaman 10 tahun..." },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-800 mb-4">
          {editId ? "Edit Pembicara" : "Tambah Pembicara"}
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
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {f.label}{" "}
                  {f.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={f.type || "text"}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required={f.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ))}
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">
            Daftar Pembicara ({list.length})
          </h3>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400 text-sm">Memuat...</div>
        ) : list.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">
            Belum ada pembicara.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Nama</th>
                  <th className="text-left px-5 py-3 font-semibold">Spesialisasi</th>
                  <th className="text-left px-5 py-3 font-semibold">Instansi</th>
                  <th className="text-left px-5 py-3 font-semibold">Email</th>
                  <th className="text-left px-5 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-xs overflow-hidden flex-shrink-0">
                          {item.foto ? (
                            <img
                              src={item.foto}
                              alt={item.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "👤"
                          )}
                        </div>
                        <span className="font-medium text-gray-800">{item.nama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{item.spesialisasi}</td>
                    <td className="px-5 py-3 text-gray-600">{item.instansi}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{item.email}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
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

export default PembicaraAdmin;