const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database MA Jateng...')

  // Create Admin
  const hashedPassword = await bcrypt.hash('majateng2026', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nama: 'Administrator PW MA Jateng',
    }
  })
  console.log('✅ Admin created: username=admin, password=majateng2026')

  // Seed Pengaturan dasar
  const pengaturan = [
    { kunci: 'nama_organisasi', nilai: "Pengurus Wilayah Mathla'ul Anwar Jawa Tengah" },
    { kunci: 'alamat', nilai: 'Jl. Contoh No. 1, Semarang, Jawa Tengah' },
    { kunci: 'telepon', nilai: '(024) xxx-xxxx' },
    { kunci: 'email', nilai: 'pw@mathlaularwanjateng.id' },
    { kunci: 'whatsapp', nilai: '6281234567890' },
    { kunci: 'sambutan_ketua', nilai: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi Pengurus Wilayah Mathla'ul Anwar Jawa Tengah. Semoga kehadiran website ini menjadi sarana informasi yang bermanfaat bagi seluruh warga MA dan masyarakat Jawa Tengah." },
    { kunci: 'nama_ketua', nilai: 'Dr. H. [Nama Ketua], M.Ag.' },
    { kunci: 'facebook', nilai: 'https://facebook.com/mawilayahjateng' },
    { kunci: 'instagram', nilai: 'https://instagram.com/mawilayahjateng' },
    { kunci: 'youtube', nilai: 'https://youtube.com/@mawilayahjateng' },
  ]

  for (const p of pengaturan) {
    await prisma.pengaturan.upsert({
      where: { kunci: p.kunci },
      update: { nilai: p.nilai },
      create: p,
    })
  }
  console.log('✅ Pengaturan dasar berhasil di-seed')

  // Seed contoh berita
  await prisma.berita.upsert({
    where: { slug: 'selamat-datang-di-website-resmi-pw-ma-jateng' },
    update: {},
    create: {
      judul: "Selamat Datang di Website Resmi PW Mathla'ul Anwar Jawa Tengah",
      slug: 'selamat-datang-di-website-resmi-pw-ma-jateng',
      ringkasan: "Alhamdulillah, website resmi Pengurus Wilayah Mathla'ul Anwar Jawa Tengah kini telah hadir untuk melayani informasi seluruh warga MA dan masyarakat Jawa Tengah.",
      isi: "Alhamdulillah, dengan memanjatkan puji syukur ke hadirat Allah SWT, website resmi Pengurus Wilayah Mathla'ul Anwar Jawa Tengah kini telah resmi diluncurkan. Website ini hadir sebagai media informasi dan komunikasi antara pengurus, anggota, dan masyarakat luas.",
      kategori: 'Umum',
      diterbitkan: true,
    }
  })
  console.log('✅ Contoh berita berhasil di-seed')

  console.log('🎉 Seeding selesai!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
