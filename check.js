const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const berita = await prisma.berita.findMany({ take: 3, orderBy: { createdAt: 'desc' }});
  console.log(JSON.stringify(berita.map(b => ({ judul: b.judul, thumbnail: b.thumbnail })), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
