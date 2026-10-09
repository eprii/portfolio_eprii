# Pemeriksaan revisi UI dan mobile

Basis pengerjaan: `portfolio_eprii_new.zip`. Pemeriksaan akhir dilakukan pada 10 Oktober 2026 menggunakan Chromium 153 headless melalui Playwright, server HTTP lokal pada path repository, serta pembukaan `index.html` langsung melalui `file://`.

## Hasil browser

**72 pemeriksaan terarah lulus:** 57 pada rangkaian interaksi utama, 11 pada kondisi tambahan/fallback, dan 4 pada pemeriksaan cursor serta penghentian scroll. Tidak ada error JavaScript atau permintaan aset yang gagal pada rangkaian halaman normal. Error yang sengaja disisipkan untuk menguji fallback dipisahkan dari pengujian normal.

| Area | Yang diperiksa |
| --- | --- |
| Navbar desktop | Blur aktif, posisi indikator, gerakan indikator di antara tautan, anchor offset, section aktif, Back/Forward, deep link ke delapan section, perubahan hash pada dokumen yang sama |
| Navbar mobile | Dua kolom, tombol minimal 44 px, animasi masuk, status inert saat menutup, buka/tutup berulang cepat, Escape, klik di luar panel, label section, menu landscape yang bisa bergulir |
| Boot | Animasi zoom-out, Ready tetap terlihat, animasi keluar dengan scale/blur, transisi konten yang sedang terlihat, posisi deep link tidak berubah, Tab untuk melewati, perubahan preferensi gerak saat transisi berjalan |
| Scroll desktop | Input wheel bergerak bertahap, jarak dikurangi sesuai konfigurasi, pembalikan arah, penghentian oleh keyboard dan ketika menyela navigasi anchor, area scroll bersarang, pengecualian input horizontal dan modifier/pinch |
| Mobile | Scroll native menggunakan simulasi input sentuh Chromium; swipe galeri dan menu landscape tetap berfungsi |
| Lightbox | Galeri, tiga sertifikat asli, tiga screenshot proyek, caption, navigasi keyboard, siklus fokus, Escape, penguncian scroll, pemulihan scroll dan fokus |
| Fitur lama | Back-to-top, Note Skills, status play/stop bintang audio, cursor khusus setelah boot dan cursor native pada boot/lightbox |
| Fallback | Tanpa JavaScript, reduced motion, script awal yang tertahan, CSS failsafe setelah boot script sengaja gagal, akses file lokal |

Dalam uji wheel terukur, input vertikal 240 px menghasilkan perpindahan 173 px setelah pembulatan browser, sesuai faktor `.72`. Posisi awal 1000 px bergerak bertahap melalui 1030 px sebelum berhenti di 1173 px. Rasa scroll pada trackpad fisik tetap bergantung pada sistem operasi, pengaturan perangkat, dan browser.

Waktu boot yang terukur pada rangkaian utama: loading 2200 ms, Ready 1001 ms, dan transisi keluar 650 ms. Durasi loading/Ready mempertahankan nilai dari ZIP terbaru, bukan mengembalikannya ke versi sebelumnya.

## Tampilan dan aksesibilitas

| Viewport | Hasil |
| --- | --- |
| 320 × 740 | Layout mobile sempit diperiksa; tidak ada overflow horizontal atau aset rusak |
| 390 × 844 | Seluruh section, menu, sertifikat, galeri, dan boot diperiksa |
| 768 × 1024 | Layout tablet diperiksa; tidak ada overflow horizontal atau aset rusak |
| 1024 × 768 | Layout laptop/tablet diperiksa; tidak ada overflow horizontal atau aset rusak |
| 1366 × 768 | Seluruh section dan navbar desktop diperiksa |
| 740 × 360 | Menu landscape tetap berada di viewport dan tautan bawah dapat diakses |

Screenshot desktop dan mobile ditinjau secara visual. Foto lazy-loading diperiksa kembali setelah selesai dimuat; keenam foto Beyond tersedia. Preview sertifikat mempertahankan rasio gambar dan terbuka dalam lightbox.

Axe-core dijalankan untuk WCAG 2 A/AA dan WCAG 2.1 AA pada lima kondisi: halaman mobile, menu mobile terbuka, lightbox mobile, halaman desktop, dan lightbox desktop. **Tidak ada pelanggaran otomatis yang terdeteksi.** Ini bukan sertifikasi kepatuhan atau pengganti pengujian pembaca layar.

## Perbaikan yang ditemukan saat verifikasi

- Tinggi navbar dibuat tetap agar perpindahan ke mode compact tidak menggeser perhitungan offset anchor.
- Target navigasi tetap ditandai selama perpindahan melewati section lain; indikator kembali mengikuti scroll ketika pengguna mengambil alih.
- Panel mobile langsung inert selama animasi keluar dan membatalkan animasi sebelumnya ketika dibuka kembali.
- Perubahan preferensi reduced motion membatalkan transisi konten boot yang masih berjalan.
- Cursor khusus tidak disembunyikan di balik overlay boot; cursor native digunakan selama intro.
- Dimensi gambar profil dan sertifikat disesuaikan dengan aset yang disediakan untuk menyediakan ruang sebelum gambar dimuat.

## Integritas dan review

- Teks pada `main` dan Footer dibandingkan dengan ZIP terbaru setelah normalisasi whitespace: tetap sama.
- Semua URL tautan dibandingkan dan dipertahankan. Tujuan eksternal tidak diuji melalui login.
- Seluruh aset sumber dibandingkan byte demi byte: tidak berubah.
- ID, anchor yang mempunyai target, path CSS/JS, dan referensi aset lokal diperiksa.
- Sintaks semua JavaScript diperiksa dengan `node --check`.
- Pedoman anti-slop digunakan untuk review teks, desain, dan kode. Tidak ada pembersihan otomatis pada source. Background tetap memakai cream, biru, dan sedikit warna hangat; kaca digunakan pada navigasi dan animasi fokus dibatasi pada intro.
- Detector dijalankan pada teks pengunjung serta dokumentasi baru. Hasil script dipakai sebagai petunjuk untuk review manual.
- Delapan poin revisi awal pada `REVISION-REQUIREMENTS.md` tidak diubah. Catatan uji yang dibawa ZIP sumber disimpan pada `TESTING-PREVIOUS.md`; angkanya tidak digabungkan ke hasil versi ini.

## Batas pemeriksaan

Safari/WebKit, Firefox, trackpad fisik, perangkat iOS/Android fisik, pembaca layar, dan keluaran audio yang benar-benar terdengar belum diuji. Status audio dan pemuatan asetnya diperiksa. Tidak ada deployment ke akun GitHub; penggunaan path repository diuji secara lokal.

Tautan source proyek, tautan pendidikan `href="#"`, dan alamat WhatsApp yang perlu diperiksa pemilik dijelaskan di README. Informasi personal atau URL baru tidak ditebak untuk melengkapi bagian tersebut.
