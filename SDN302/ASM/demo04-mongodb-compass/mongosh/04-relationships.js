// ============================================================
// SDN302 - Slot 3.2 - Mapping relationships: embedding vs referencing
// ============================================================
use('booknest');

// --- EMBEDDED (one-to-few): reviews live INSIDE the book document ---------
// + one single read, atomic update, no join
// - the document grows (16 MB limit), the review cannot be queried on its own
db.books.findOne({ title: 'Clean Code' }, { title: 1, reviews: 1 });
db.books.updateOne({ title: 'Clean Code' }, { $push: { reviews: { user: 'tam.tran', rating: 5, comment: 'Timeless' } } });

// --- REFERENCED (one-to-many): the book stores the ObjectId of the author -
// + no duplication, the author can be updated in one place
// - reading needs a $lookup (or populate() in Mongoose - Slot 5.1)
db.books.findOne({ title: 'Clean Code' }, { title: 1, authorId: 1 });
db.authors.findOne({ _id: ObjectId('660000000000000000000002') });

// Manual "join"
db.books.aggregate([
  { $match: { title: 'Clean Code' } },
  { $lookup: { from: 'authors', localField: 'authorId', foreignField: '_id', as: 'author' } },
  { $unwind: '$author' },
  { $project: { _id: 0, title: 1, 'author.name': 1, 'author.country': 1 } }
]);

// Rule of thumb taught in class:
//   one-to-few + always read together  -> EMBED
//   one-to-many / many-to-many, shared -> REFERENCE
