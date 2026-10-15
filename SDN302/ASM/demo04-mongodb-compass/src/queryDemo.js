/**
 * Slot 3.3 - the same queries as in mongosh, executed from Node.js.
 * Useful in class to show that the shell, Compass and the driver speak
 * exactly the same query language.
 * Run: npm run queries
 */
const { connectDB, closeDB } = require('./db');

(async () => {
  const db = await connectDB();
  const books = db.collection('books');

  console.log('\n1) Books over 400,000 VND');
  console.table(await books.find({ price: { $gt: 400000 } }).project({ title: 1, price: 1, _id: 0 }).toArray());

  console.log('\n2) Title contains "mongo" (case-insensitive)');
  console.table(await books.find({ title: { $regex: 'mongo', $options: 'i' } }).project({ title: 1, _id: 0 }).toArray());

  console.log('\n3) Page 2, 3 items per page, sorted by price desc');
  console.table(await books.find().sort({ price: -1 }).skip(3).limit(3).project({ title: 1, price: 1, _id: 0 }).toArray());

  console.log('\n4) Count per category ($lookup + $group)');
  console.table(await books.aggregate([
    { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'cat' } },
    { $unwind: '$cat' },
    { $group: { _id: '$cat.name', total: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
    { $sort: { total: -1 } }
  ]).toArray());

  await closeDB();
})();
