const BiodataPage = () => {
  const data = {
    nama: "Binar Maulla Zaqi", // Silakan sesuaikan nama lengkap lu di sini bray
    nim: "22XXXXXXXX",        // Sesuaikan NIM lu
    kelas: "TI-XX-XX",       // Sesuaikan kelas lu
    prodi: "Teknik Informatika",
    matkul: "Pemrograman Web 2",
    dosen: "Nama Dosen Pengampu",
    semester: "IV",
    tahun: "2025/2026",
    github: "https://github.com/username", // Sesuaikan link github lu
    email: "email@mahasiswa.ac.id",        // Sesuaikan email kampus/pribadi lu
    deskripsi:
      "Aplikasi ini dibuat sebagai tugas UTS mata kuliah Pemrograman Web 2. " +
      "Sistem manajemen event bertema industri kopi yang dibangun dengan " +
      "React, TypeScript, Express.js, Prisma ORM, dan Zustand.",
  };

  const techStack = [
    { nama: "React + TypeScript", icon: "⚛️", peran: "Frontend" },
    { nama: "Tailwind CSS", icon: "🎨", peran: "Styling" },
    { nama: "Zustand", icon: "🐻", peran: "State Management" },
    { nama: "Express.js", icon: "🚂", peran: "Backend API" },
    { nama: "Prisma ORM", icon: "🗄️", peran: "ORM" },
    { nama: "PostgreSQL", icon: "🐘", peran: "Database" },
  ];

  const infoItems = [
    { label: "Mata Kuliah", value: data.matkul },
    { label: "Dosen Pengampu", value: data.dosen },
    { label: "Semester", value: data.semester },
    { label: "Tahun Ajaran", value: data.tahun },
  ];

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Card Profil Utama */}
        <div className="bg-amber-900 text-white rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            👤
          </div>
          <h1 className="text-2xl font-bold">{data.nama}</h1>
          <p className="text-amber-300 text-sm mt-1">NIM: {data.nim}</p>
          <p className="text-amber-400 text-sm">{data.kelas} · {data.prodi}</p>
        </div>

        {/* Grid Informasi Kuliah */}
        <div className="grid grid-cols-2 gap-3">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl p-4 border border-amber-100"
            >
              <p className="text-xs text-amber-600 font-semibold uppercase">
                {item.label}
              </p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tentang Project */}
        <div className="bg-white rounded-xl p-5 border border-amber-100">
          <h2 className="font-bold text-gray-800 mb-2">Tentang Project</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{data.deskripsi}</p>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-xl p-5 border border-amber-100">
          <h2 className="font-bold text-gray-800 mb-4">Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.nama}
                className="flex items-center gap-3 bg-amber-50 rounded-lg p-3"
              >
                <span className="text-xl">{tech.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{tech.nama}</p>
                  <p className="text-xs text-gray-500">{tech.peran}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Sosial Media */}
        <div className="flex gap-3">
          {/* ✅ FIX: Tag pembuka <a> sekarang sudah utuh dan aman */}
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            🔗 GitHub
          </a>
          
          <a
            href={`mailto:${data.email}`}
            className="flex-1 text-center bg-amber-800 hover:bg-amber-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            ✉️ Email
          </a>
        </div>

      </div>
    </div>
  );
};

export default BiodataPage;