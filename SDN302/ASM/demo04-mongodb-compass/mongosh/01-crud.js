// ============================================================
// SDN302 - Slot 3.2 - CRUD operations in MongoDB Shell (mongosh)
// Run:  mongosh < mongosh/01-crud.js      (or paste block by block)
// The SAME commands can be typed in the Compass "MONGOSH" panel
// at the bottom of the Compass window.
// ============================================================
use('booknest');

// ---------- CREATE ----------
db.categories.insertOne({ name: 'Self-help', description: 'Personal development' });

db.books.insertMany([
  { title: 'Atomic Habits', isbn: '9780735211292', price: 210000, quantity: 25, publishedYear: 2018,
    tags: ['habits', 'productivity'], inStock: true, reviews: [] },
  { title: 'Deep Work', isbn: '9781455586691', price: 195000, quantity: 18, publishedYear: 2016,
    tags: ['focus', 'productivity'], inStock: true, reviews: [] }
]);

// ---------- READ ----------
db.books.find();                                   // all documents
db.books.findOne({ title: 'Clean Code' });         // one document
db.books.countDocuments();                         // how many

// ---------- UPDATE ----------
db.books.updateOne({ title: 'Clean Code' }, { $set: { price: 495000 } });
db.books.updateOne({ title: 'Clean Code' }, { $inc: { quantity: -1 } });          // sell one copy
db.books.updateMany({ quantity: { $lte: 0 } }, { $set: { inStock: false } });
db.books.updateOne({ title: 'Deep Work' }, { $push: { tags: 'bestseller' } });    // array operator

// upsert: update if found, insert if not
db.books.updateOne(
  { isbn: '9999999999999' },
  { $set: { title: 'Placeholder book', price: 1, quantity: 0 } },
  { upsert: true }
);

// ---------- DELETE ----------
db.books.deleteOne({ isbn: '9999999999999' });
db.books.deleteMany({ price: { $lt: 1000 } });

print('CRUD demo finished. Refresh Compass to see the changes.');
