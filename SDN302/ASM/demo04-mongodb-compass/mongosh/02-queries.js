// ============================================================
// SDN302 - Slot 3.2 - Query operators, projection, sort, paging
// Every filter below can be pasted directly into the Compass
// FILTER bar; SORT / PROJECT / SKIP / LIMIT have their own boxes
// under "Options" in the Compass Documents tab.
// ============================================================
use('booknest');

// ---------- comparison operators ----------
db.books.find({ price: { $gt: 400000 } });                       // greater than
db.books.find({ price: { $gte: 300000, $lte: 500000 } });         // range
db.books.find({ publishedYear: { $ne: 2008 } });                  // not equal
db.books.find({ quantity: { $in: [0, 3, 5] } });                  // in a list
db.books.find({ tags: { $nin: ['novel'] } });                     // not in a list

// ---------- logical operators ----------
db.books.find({ $and: [{ inStock: true }, { price: { $lt: 300000 } }] });
db.books.find({ $or: [{ tags: 'mongodb' }, { tags: 'javascript' }] });

// ---------- element / array operators ----------
db.books.find({ reviews: { $exists: true, $ne: [] } });
db.books.find({ tags: { $all: ['mongodb', 'nosql'] } });
db.books.find({ 'reviews.rating': { $gte: 5 } });                 // dot notation into an array
db.books.find({ reviews: { $size: 2 } });

// ---------- regular expression (search box behaviour) ----------
db.books.find({ title: { $regex: 'mongo', $options: 'i' } });

// ---------- projection: only the fields we need ----------
db.books.find({}, { title: 1, price: 1, _id: 0 });

// ---------- sort, skip, limit = pagination ----------
const page = 2, size = 3;
db.books.find()
  .sort({ price: -1 })            // -1 descending, 1 ascending
  .skip((page - 1) * size)
  .limit(size);

// ---------- distinct & count ----------
db.books.distinct('tags');
db.books.countDocuments({ inStock: true });

// ---------- index (Compass: Indexes tab -> Create Index) ----------
db.books.createIndex({ title: 'text', tags: 'text' });   // text index for search
db.books.find({ $text: { $search: 'mongodb' } });
db.books.createIndex({ price: -1 });
db.books.find({ price: { $gt: 400000 } }).explain('executionStats');  // compare with Compass "Explain Plan"
