<p align="center">
  <img src="assets/images/icon.png" width="100" alt="Quran Pesat Logo" />
</p>

<h1 align="center">🕌 Quran Pesat</h1>

<p align="center">
  <b>Aplikasi Islami lengkap untuk menemani ibadah harian Anda</b><br/>
  <sub>Dibuat dengan ❤️ untuk umat Muslim</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-Expo-blue?logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green" />
  <img src="https://img.shields.io/badge/Version-1.0.0-orange" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## ✨ Tentang Aplikasi

**Quran Pesat** adalah aplikasi mobile berbasis React Native (Expo) yang dirancang untuk membantu umat Muslim dalam menjalankan ibadah sehari-hari. Aplikasi ini menyediakan berbagai fitur islami dalam satu tempat dengan tampilan yang modern, bersih, dan nyaman digunakan.

---

## 📱 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📖 **Al-Quran** | Baca Al-Quran lengkap 114 surat dengan terjemahan Bahasa Indonesia |
| 🤲 **Doa Harian** | Kumpulan doa sehari-hari lengkap dengan teks Arab dan artinya |
| 📿 **Dzikir** | Dzikir pagi, sore, dan setelah sholat dengan penghitung |
| 📜 **Hadits** | Koleksi hadits shahih dari berbagai perawi |
| 🕋 **Arah Kiblat** | Penunjuk arah kiblat menggunakan Google Qibla Finder |
| 🕐 **Jadwal Sholat** | Waktu sholat otomatis berdasarkan lokasi |
| 🤖 **Asisten AI Islami** | Chatbot AI yang menjawab pertanyaan seputar Islam (Gemini API) |
| 📛 **Asmaul Husna** | 99 nama-nama Allah beserta arti dan latinnya |
| 🗓️ **Kalender Hijriah** | Kalender Islam dengan konversi tanggal |
| 🧮 **Kalkulator Zakat** | Hitung zakat fitrah & zakat maal dengan mudah |
| 🔔 **Notifikasi** | Pengaturan pengingat sholat & baca Al-Quran |
| 💰 **Donasi** | Halaman dukungan untuk pengembangan aplikasi |
| ⚙️ **Pengaturan** | Kelola preferensi aplikasi |

---

## 🖼️ Tampilan Aplikasi

### Halaman Utama
| Beranda | Al-Quran | Artikel | Pengaturan |
|:---:|:---:|:---:|:---:|
| ![Beranda](assets/Screenshot/f327da7c-a54e-4f1c-95e2-891a6529f74a.webp) | ![Al-Quran](assets/Screenshot/978cc732-ee49-48ff-ade3-2abc3e1ba3be.webp) | ![Artikel](assets/Screenshot/d935c9ea-07f9-4d11-8aea-d9e80a96ae6c.webp) | ![Pengaturan](assets/Screenshot/85033631-73e3-43c2-a41b-d2b5ce9394b8.webp) |

### Fitur Islami
| Baca Surat | Doa Harian | Detail Doa | Hadits |
|:---:|:---:|:---:|:---:|
| ![Baca Surat](assets/Screenshot/47b23fde-0b09-48d0-95e9-783a960e8451.webp) | ![Doa Harian](assets/Screenshot/6e560821-5211-4728-a09f-c0e479744873.webp) | ![Detail Doa](assets/Screenshot/16833ebd-d476-4141-a938-8436aeee7667.webp) | ![Hadits](assets/Screenshot/bd85f4a5-b2b1-404b-9fbf-cb6606ae46f6.webp) |

### Fitur Tambahan
| Dzikir | Asmaul Husna | Kalender Hijriah | Kalkulator Zakat |
|:---:|:---:|:---:|:---:|
| ![Dzikir](assets/Screenshot/b0a8a4c6-c0a7-487a-9473-f25cc127142a.webp) | ![Asmaul Husna](assets/Screenshot/d978486f-c9e5-4404-bc72-7e2f71c02fd4.webp) | ![Kalender](assets/Screenshot/15f6a176-9d1d-438b-94e1-d3e8c4459bec.webp) | ![Zakat](assets/Screenshot/554c9f1b-51e6-4c3d-a3fe-885ef220580f.webp) |

### AI & Lainnya
| Asisten AI | Detail Hadits | Notifikasi | Lainnya |
|:---:|:---:|:---:|:---:|
| ![AI](assets/Screenshot/dfed9225-4b49-4db5-a474-d8a36cffa911.webp) | ![Detail Hadits](assets/Screenshot/185d741a-d206-4df7-9a38-9674bef69f57.webp) | ![Notifikasi](assets/Screenshot/12987906-5501-4aa6-82e0-0bef5cc0ac87.webp) | ![Lainnya](assets/Screenshot/d2e10c45-9076-4a0e-9ce2-004eaa0105de.webp) |

---

## 🛠️ Tech Stack

- **Framework:** React Native + Expo (SDK 52)
- **Routing:** Expo Router (File-based routing)
- **Bahasa:** TypeScript
- **AI Engine:** Google Gemini API
- **API Islami:** [Aladhan API](https://aladhan.com/prayer-times-api), [Al-Quran Cloud API](https://alquran.cloud/api)
- **Arah Kiblat:** [Google Qibla Finder](https://qiblafinder.withgoogle.com/)
- **Icons:** Lucide React Native
- **UI Framework:** React Native Safe Area Context, Expo Blur

---

## 🚀 Cara Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) di HP Android/iOS

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Bimakanz/QuranApp.git

# 2. Masuk ke folder project
cd QuranApp

# 3. Install dependencies
npm install

# 4. Jalankan aplikasi
npx expo start
```

Scan QR code yang muncul di terminal menggunakan aplikasi **Expo Go** di HP kamu.

---

## 🔑 Konfigurasi API Key (Opsional)

Untuk mengaktifkan fitur **Asisten AI Islami**, kamu perlu API Key dari Google Gemini:

1. Buka [Google AI Studio](https://aistudio.google.com/)
2. Buat API Key gratis
3. Buka file `app/(tabs)/AI.tsx`
4. Masukkan key di variabel `GEMINI_API_KEY`

```typescript
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
```

---

## 📁 Struktur Project

```
QuranApp/
├── app/
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── Home.tsx         # Beranda utama
│   │   ├── AlQuran.tsx      # Halaman Al-Quran
│   │   ├── Artikel.tsx      # Halaman Artikel
│   │   ├── Pengaturan.tsx   # Pengaturan aplikasi
│   │   ├── AI.tsx           # Asisten AI Islami
│   │   └── _layout.tsx      # Tab layout & floating navbar
│   ├── ArahKiblat.tsx       # Google Qibla Finder
│   ├── AsmaulHusna.tsx      # 99 Asmaul Husna
│   ├── DoaHarian.tsx        # Kumpulan doa harian
│   ├── Dzikir.tsx           # Dzikir pagi, sore, sholat
│   ├── Hadits.tsx           # Koleksi hadits
│   ├── KalenderHijrah.tsx   # Kalender Hijriah
│   ├── KalkulatorZakat.tsx  # Kalkulator zakat
│   ├── Notifikasi.tsx       # Pengaturan notifikasi
│   ├── Donasi.tsx           # Halaman donasi
│   ├── Lainnya.tsx          # Menu tambahan
│   └── ...
├── assets/                  # Gambar & aset
├── app.json                 # Konfigurasi Expo
└── package.json             # Dependencies
```

---

## 👨‍💻 Developer

Dikembangkan secara individu dengan penuh dedikasi.

> *"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya."*
> — HR. Ahmad, ath-Thabrani, ad-Daruqutni

---

## 📄 Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE).

---

<p align="center">
  <b>Quran Pesat v1.0.0</b><br/>
  <sub>Made with ❤️ for Muslims</sub>
</p>
