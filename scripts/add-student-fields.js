// @ts-nocheck
const postgres = require('postgres');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const m = env.split(/\r?\n/).find((l) => l.startsWith('DATABASE_URL='));
if (!m) {
  console.error('no DATABASE_URL');
  process.exit(1);
}
const url = m.replace('DATABASE_URL=', '').trim().replace(/^"|"$/g, '');

const sql = postgres(url, { ssl: 'require' });

(async () => {
  try {
    await sql('ALTER TABLE students ADD COLUMN IF NOT EXISTS phone varchar(30);');
    await sql('ALTER TABLE students ADD COLUMN IF NOT EXISTS address text;');
    console.log('added phone/address columns if missing');
  } catch (e) {
    console.error('error altering table', e);
    process.exit(1);
  } finally {
    await sql.end();
  }
})();
