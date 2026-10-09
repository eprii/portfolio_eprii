# Hasil pemeriksaan revisi

Pengujian dilakukan pada source hasil revisi, melalui server HTTP lokal dengan path `/portfolio/`, serta pembukaan `index.html` lewat `file://`. Browser: Chromium 153.0.8010.0 headless melalui Playwright. Ukuran layar dan sentuhan disimulasikan; ini bukan pengujian pada perangkat fisik.

## Temuan awal yang diperiksa

| Temuan | Perubahan dan bukti |
| --- | --- |
| Halaman dengan hash gagal menginisialisasi navigasi | Error awal `Cannot access 'scrollToSection' before initialization` berhasil direproduksi. Urutan inisialisasi diperbaiki; setiap anchor utama kemudian diuji. |
| Enam screenshot tidak tersedia | Permintaan awal menghasilkan HTTP 404. Referensi file kedua/ketiga dipindahkan ke komentar TODO; viewer menghitung gambar yang benar-benar tersedia. |
| Tiga tautan source tanpa target | Anchor `project-01-source` hingga `project-03-source` tidak punya tujuan. Sekarang menjadi teks placeholder yang jelas. Nilai lama tetap disimpan dalam atribut. |
| Konten reveal tersembunyi tanpa JavaScript | Konten sekarang terlihat secara default; hanya elemen yang sudah dipantau observer dibuat menunggu reveal. |
| Menu mobile tersembunyi masih ada dalam urutan fokus | Panel menggunakan `hidden`, sehingga tautannya tidak dapat difokuskan ketika menu tertutup. |
| Jarak scroll berubah saat navbar mengecil | Offset layout dipisahkan dari tinggi navbar saat scroll. Posisi sebelum/sesudah lightbox kembali sama dalam uji browser. |
| Warna teks sekunder kurang kontras | Kontras awal 4,44:1 terdeteksi pada beberapa label. Token warna digelapkan; nomor proyek tetap transparan dengan kontras yang lebih jelas. |
| Styling lama yang tidak dimuat | `css/style.css` bukan bagian dari stylesheet aktif; dihapus setelah seluruh referensi diperiksa. |

## Pengujian otomatis dan interaksi

**85 assertion browser lulus** pada rangkaian regresi utama. Tidak ada exception JavaScript atau permintaan aset HTTP 4xx/5xx pada halaman uji normal.

- Urutan sembilan section utama, tiga proyek, enam foto, tagline, jarak judul dari navbar, serta hubungan tanggal dan penempatan magang.
- Membuka About, Work, Experience, Education, Achievement, Skills, Beyond, dan Contact langsung melalui hash; memeriksa indikator aktif dan jarak dari navbar.
- Browser Back/Forward, back-to-top, dan skip link ke `main`.
- Galeri dibuka dengan Enter; caption asli, gambar penuh, dan `object-fit: contain` diperiksa.
- Fokus awal tombol X, siklus Tab/Shift+Tab, panah keyboard, tombol sebelumnya/berikutnya, serta perpindahan melingkar dari foto terakhir ke pertama.
- Penutupan melalui Escape, X, dan latar overlay; scroll terkunci selama modal terbuka, lalu fokus dan posisi scroll pulih.
- Swipe menggunakan input sentuh Chromium yang disimulasikan.
- Ketiga screenshot asli dibuka. Jumlah `01 / 01` dan tombol yang dinonaktifkan ketika hanya ada satu gambar diperiksa.
- Viewer dengan tiga gambar diuji lewat fixture terpisah memakai aset yang sudah ada. Tombol, panah keyboard, dan pembukaan pada gambar aktif berfungsi. Gambar fixture tidak masuk ke ZIP.
- Empat tombol Note di Skills, menu mobile, Escape, klik di luar menu, dan tautan Education mobile.
- Cursor khusus pada pointer halus, cursor native pada sentuhan/reduced motion, serta status play/stop easter egg.
- Boot saat script awal ditunda, penutupan setelah siap, dan fallback ketika script utama gagal dimuat.
- Mode tanpa JavaScript: konten dan navigasi tersedia, boot tersembunyi, Note terbaca, dan galeri menjadi tautan gambar biasa.

Pemeriksaan tambahan: membuka file langsung, menguji batas maksimum boot ketika script tertahan, menguji slot sertifikat dalam fixture terpisah, dan memeriksa ulang overflow pada lima lebar layar. Hasilnya lulus. Tidak ada sertifikat percobaan atau aset fiktif yang dimasukkan ke source final.

## Responsive dan pemeriksaan visual

| Viewport | Hasil |
| --- | --- |
| 1366 × 768 | Desktop diperiksa; tidak ada overflow horizontal atau aset rusak |
| 1024 × 768 | Layout laptop/tablet diperiksa; tidak ada overflow horizontal atau aset rusak |
| 768 × 1024 | Tablet diperiksa; tidak ada overflow horizontal atau aset rusak |
| 390 × 844 | Mobile diperiksa; tidak ada overflow horizontal atau aset rusak |
| 320 × 740 | Mobile sempit diperiksa; tidak ada overflow horizontal atau aset rusak |

Screenshot Hero, About, Work, Experience, Education, Achievement, Skills, Beyond, dan Contact ditinjau pada desktop dan mobile. Lightbox serta boot juga diperiksa secara visual. Perbaikan tambahan dilakukan pada aturan grid timeline BIB di mobile dan offset anchor agar tidak dihitung dua kali.

Axe-core dijalankan untuk aturan WCAG 2 A/AA dan WCAG 2.1 AA, pada halaman penuh serta lightbox di desktop dan mobile. **Tidak ada pelanggaran otomatis yang terdeteksi pada pemeriksaan akhir.** Reduced motion diaktifkan pada audit otomatis terakhir agar semua konten reveal tercakup. Pemeriksaan otomatis ini tidak menggantikan pengujian dengan pembaca layar.

## Integritas dan anti-slop

- Semua ID unik; semua anchor aktif dan path aset HTML/CSS mengarah ke target yang tersedia.
- Seluruh aset biner asli dibandingkan byte demi byte dan tetap sama.
- URL GitHub, sosial, WhatsApp, serta email dibandingkan dengan source awal dan dipertahankan.
- Sintaks seluruh file JavaScript diperiksa dengan `node --check`.
- `SKILL.md`, ketiga referensi, dan README anti-slop dibaca. Teks, komposisi, serta kode ditinjau secara manual.
- `detect_slop.py` dijalankan pada teks pengunjung dan README; keduanya memperoleh 0/100. Nilai ini hanya hasil pencocokan pola, bukan jaminan kualitas tulisan.
- `clean_slop.py` dijalankan dalam mode preview pada salinan teks. Saran menghapus kata “actually” pada kalimat personal tidak diterapkan; suara pemilik tetap dipertahankan. Tidak ada pembersihan otomatis terhadap source.
- Delapan poin revisi asli disimpan tanpa penulisan ulang di `REVISION-REQUIREMENTS.md`.

## Batas pemeriksaan

- Safari/WebKit, Firefox, perangkat iOS/Android fisik, pembaca layar, dan keluaran audio yang benar-benar terdengar belum diuji. Status interaksi audio dan pemuatan aset diperiksa.
- Tautan eksternal dipertahankan dan diperiksa penulisannya; ketersediaan akun atau halaman tujuannya tidak diverifikasi melalui login.
- Tidak ada deployment ke akun GitHub. Path repository diuji secara lokal.
- Sertifikat resmi, badge resmi, URL source proyek, detail lomba, dan informasi pendidikan yang belum disediakan masih berupa placeholder.

## Pemeriksaan manual setelah mengisi konten

Buka setiap gambar baru dan periksa caption/alt-nya. Uji URL source dan verifikasi sertifikat yang baru diisi. Periksa kembali layout 320 px dan desktop setelah menambahkan teks panjang. Jika menambah screenshot, coba tombol panah dan swipe sebelum mengunggah ke GitHub Pages.
