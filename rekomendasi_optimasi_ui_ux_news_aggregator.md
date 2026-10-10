# Rekomendasi Optimasi UI/UX — Briefly News Aggregator

Dokumen ini berisi analisis UX/UI mendalam serta rekomendasi perbaikan desain untuk platform aggregator berita **Briefly**, berdasarkan prinsip-prinsip *Information Architecture*, *Readability*, dan *Modern Web Aesthetics*.

---

## 1. Analisis Masalah UI/UX Saat Ini

Berdasarkan gambar tangkapan layar, terdapat beberapa isu utama pada layout saat ini:

1. **Rendahnya Kontras Visual & Spatial Hierarchy:**
   - Semua kartu (*cards*) memiliki outline tipis berwarna abu-abu yang seragam tanpa variasi kedalaman (*elevation/shadow*) atau kontras warna latar belakang yang memadai.
   - Jarak antar seksi (*section spacing*) terlalu ketat sehingga konten terlihat padat namun sulit di-scan (*low scannability*).

2. **Hierarki Tipografi Kurang Tegas:**
   - *Headlines* berita utama, berita *Trending*, dan berita per kategori memiliki ukuran serta *weight* font yang mirip.
   - Kurangnya variasi ukuran judul membuat mata pengguna cepat lelah karena kesulitan menentukan titik fokus utama (*Visual Anchor*).

3. **Integritas "Aggregator" & Sumber Berita Kurang Menonjol:**
   - Sebagai agregator berita terpercaya, identitas sumber berita (logo media asal, tingkat kepercayaan/verifikasi, jumlah sumber yang dirangkum) tersembunyi di bagian pojok kanan bawah tiap card dengan ukuran font sangat kecil.

4. **Navigasi Kategori Berulang:**
   - Kategori ditampilkan berulang kali: di Header, di Sidebar (*Topics*), dan sebagai *Section Header* di bagian bawah layout.

---

## 2. Strategi Perbaikan Utama

### A. Layout & Spatial Architecture
* **Sistem Grid 12-Kolom yang Dinamis:**
  * Gunakan rasio 8:4 (Main Content : Sidebar) pada Hero Section untuk menekankan berita utama (*Main Featured Story*).
  * Variasikan tata letak kartu pada seksi *Latest Stories* (kombinasi 1 *Large Card* + 2-3 *Compact List Cards* daripada pola grid 3-kolom seragam).
* **Margin & Padding:**
  * Tingkatkan *whitespace* antar seksi minimal **48px–64px** untuk menciptakan ruang bernapas (*visual breathing room*).

### B. Desain Kartu Berita (Card Redesign)
* **Metadata & Source Badge:**
  * Pindahkan nama/logo sumber berita (misal: *Reuters, BBC, Bloomberg*) ke bagian **kiri atas** kartu.
  * Tambahkan indikator visual angka rangkuman, contoh: `4 Sumber Terverifikasi` atau badge `Multi-Source Summary`.
* **Elevasi & State Interactive:**
  * Hilangkan garis border abu-abu tajam; gunakan *soft border* (`rgba(0,0,0,0.06)`) atau latar belakang krem yang sedikit lebih kuat.
  * Berikan subtle hover effect (`translateY(-2px)` + `soft box-shadow`) untuk memberi balikan interaktif (*affordance*).

### C. Tipografi & Skala Pembacaan
* **Judul Utama (Hero Headline):** Perbesar ke `32px`–`38px` (Bold/Semi-bold, Serif atau High-legibility Sans-Serif) dengan *line-height* `1.25`.
* **Sub-headline & Rangkuman AI:** Ukuran `15px`–`16px` dengan warna abu-abu gelap (`#374151`) agar tetap nyaman dibaca (*contrast ratio* min 4.5:1).
* **Kategori Badge:** Ukuran `12px` ALL CAPS dengan *letter-spacing* longgar, diberi warna aksen lembut sesuai topik.

---

## 3. Detail Rencana Optimasi per Komponen

### 1. Header & Navigation Area
* **Pencarian (Search Bar):** Perbesar *search input box* di bagian atas pusat, tambahkan *quick filter chips* (misal: "Trending Hari Ini", "Teknologi AI", "Pasar Saham").
* **Trending Ticker Bar:** Gabungkan *Trending Topics* menjadi satu baris horizontal running-text atau pill-button slider persis di bawah navbar utama.

### 2. Main Hero Section (Berita Utama)
* **Visual Anchor:**
  * Berikan porsi 65% lebar layar untuk Berita Utama (Headline).
  * Sisipkan **Visual Snippet** (thumbnail artikel, ilustrasi infografis, atau grafik) jika tersedia, untuk memecah kejenuhan teks.
* **Key Editorial Takeaways Box:**
  * Ubah kotak "Key Editorial Takeaways" dari border tipis menjadi *callout container* berlatar warna sedikit kontras (misal: *soft accent color/light muted grey*) dengan icon checklist/bullet yang jelas.

### 3. Sidebar (The News in Context & Trending)
* **Compact List View:** Ubah tampilan berita sidebar menjadi list ringkas tanpa border penuh, cukup dipisahkan oleh *divider line* tipis.
* **Trending Heatmap/Metrics:** Sertakan grafik tren mini atau angka peringkat (`#1`, `#2`, `#3`) dengan gaya tipografi yang elegan.

### 4. Bottom Category Feeds (Tech, Business, Sport, etc.)
* **Horizontal Scroll / Tabbed View:**
  * Dibandingkan menumpuk 5 kategori ke bawah dengan format grid yang sama secara vertikal (yang membuat scroll terlalu panjang), gunakan pendekatan **Tabbed Section** atau **Carousel Carousel Row** untuk tiap kategori.

---

## 4. Usulan Wireframe Layout Barus (Structure Breakdown)

```
[ HEADER: Logo | Global Search Bar | Bookmark | Dark/Light Mode ]
[ TOPIC NAVIGATION: All | Tech | Business | Politics | Sports | Markets ]
-----------------------------------------------------------------------
[ HERO SECTION (8 Cols)                 ] [ SIDEBAR (4 Cols)          ]
[ - Source Badge (e.g. 5 Sources)       ] [ - The News in Context     ]
[ - Large Main Headline                 ] [   * Compact List Item 1   ]
[ - Executive Summary Paragraph          ] [   * Compact List Item 2   ]
[ - Key Takeaways Callout Box           ] [   * Compact List Item 3   ]
[ - Action Bar (Share/Save/Source Link) ] [ - Topic Momentum (Tags)   ]
-----------------------------------------------------------------------
[ SECTION: Trending Stories (Horizontal Card Slider / Grid)            ]
[ Card 1 (#1) ]  [ Card 2 (#2) ]  [ Card 3 (#3) ]  [ Card 4 (#4) ]
-----------------------------------------------------------------------
[ SECTION: Latest Curated Streams (Tabbed / Mixed Layout)              ]
[ Feature Card (Large) ] [ Compact Card 1 ] [ Compact Card 2 ]
-----------------------------------------------------------------------
[ FOOTER: Legal | Editorial Policy | Source Partners | Feedback ]
```

---

## 5. Ringkasan Quick-Wins (Bisa Langsung Diterapkan)

1. **Tingkatkan Kontras Teks:** Gelapkan warna font paragraf rangkuman agar tidak terlalu pudar/pucat.
2. **Perjelas Sumber Berita:** Buat nama penerbit/media asal tercetak bold di bagian atas setiap kartu.
3. **Tambahkan Thumbnail/Gambar:** Sediakan placeholder gambar/grafik minimalis untuk berita top headline agar tidak 100% didominasi teks monoton.
4. **Rapikan Padding Card:** Tambahkan inner padding pada setiap kartu dari `12px` menjadi `20px`–`24px`.