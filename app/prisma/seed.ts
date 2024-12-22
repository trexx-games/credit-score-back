import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  const sqls = fs
    .readFileSync(join(__dirname, 'seed.sql'))
    .toString()
    .split('\n')
    .filter((line) => line.indexOf('--') !== 0)
    .join('\n')
    .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
    .replace(/\s+/g, ' ') // excess white space
    .split(';');

  for (const sql of sqls) {
    console.log(sql);
    await prisma.$queryRawUnsafe(sql);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
