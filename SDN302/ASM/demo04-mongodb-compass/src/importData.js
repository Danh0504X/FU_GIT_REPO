/**
 * Loads the same JSON files that students import through MongoDB Compass,
 * so the shell/Compass/Node views always show identical data.
 * Run: npm run import
 */
const fs = require('fs');
const path = require('path');
const { EJSON } = require('bson');
const { connectDB, closeDB } = require('./db');

const read = (file) =>
  EJSON.parse(fs.readFileSync(path.join(__dirname, '..', 'compass', file), 'utf8'));

(async () => {
  const db = await connectDB();
  for (const [coll, file] of [
    ['authors', 'booknest.authors.json'],
    ['categories', 'booknest.categories.json'],
    ['books', 'booknest.books.json']
  ]) {
    await db.collection(coll).deleteMany({});
    const docs = read(file);
    await db.collection(coll).insertMany(docs);
    console.log(`${coll.padEnd(12)} -> ${docs.length} documents imported`);
  }
  await closeDB();
  console.log('Done. Open MongoDB Compass and refresh the booknest database.');
})();
