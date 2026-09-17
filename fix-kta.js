const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const anggota = await prisma.anggota.findMany({
    where: { status: 'DITERIMA' }
  });

  console.log(`Found ${anggota.length} anggota with status DITERIMA.`);

  for (const a of anggota) {
    const mode = a.ktaMode || 'MA';
    const thn = new Date(a.tanggalDaftar || new Date()).getFullYear();
    const urut = String(a.id).padStart(5, '0');
    const noKta = `${mode}.0013.${thn}.${urut}`;

    await prisma.anggota.update({
      where: { id: a.id },
      data: { nomorKTA: noKta }
    });
    console.log(`Updated ID ${a.id} -> ${noKta}`);
  }

  console.log('Update finished!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
