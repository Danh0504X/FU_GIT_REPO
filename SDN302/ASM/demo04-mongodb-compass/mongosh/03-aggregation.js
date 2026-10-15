// ============================================================
// SDN302 - Slot 3.2 - Aggregation pipeline
// In Compass: open the collection -> "Aggregations" tab -> Add Stage.
// Compass can export the pipeline to Node.js code (Export to language).
// ============================================================
use('booknest');

// 1. Count the books per category id, sorted descending
db.books.aggregate([
  { $group: { _id: '$categoryId', total: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
  { $sort: { total: -1 } }
]);

// 2. Join with the categories collection ($lookup = the SQL JOIN of MongoDB)
db.books.aggregate([
  { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
  { $unwind: '$category' },
  { $project: { _id: 0, title: 1, price: 1, category: '$category.name' } },
  { $sort: { price: -1 } }
]);

// 3. Inventory value per category
db.books.aggregate([
  { $match: { inStock: true } },
  { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'cat' } },
  { $unwind: '$cat' },
  { $group: { _id: '$cat.name', stockValue: { $sum: { $multiply: ['$price', '$quantity'] } }, titles: { $push: '$title' } } },
  { $sort: { stockValue: -1 } }
]);

// 4. Average rating per book (works on the embedded reviews array)
db.books.aggregate([
  { $match: { 'reviews.0': { $exists: true } } },
  { $project: { title: 1, reviewCount: { $size: '$reviews' }, avgRating: { $avg: '$reviews.rating' } } },
  { $sort: { avgRating: -1 } }
]);
