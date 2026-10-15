/**
 * Slot 3.3 - CRUD + advanced queries with the Node.js driver.
 * Compare each function with the equivalent mongosh command in mongosh/02-queries.js.
 */
const { ObjectId } = require('mongodb');
const { getDB } = require('./db');

const collection = () => getDB().collection('books');

const toObjectId = (id) => {
  if (!ObjectId.isValid(id)) throw Object.assign(new Error('Invalid ObjectId'), { status: 400 });
  return new ObjectId(id);
};

async function getAllBooks({ category, keyword, minPrice, maxPrice, sort = '-price', page = 1, limit = 5 }) {
  const filter = {};
  if (category) filter.categoryId = toObjectId(category);
  if (keyword) filter.title = { $regex: keyword, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortObj = sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    collection().find(filter).sort(sortObj).skip(skip).limit(Number(limit)).toArray(),
    collection().countDocuments(filter)
  ]);

  return { total, page: Number(page), totalPages: Math.ceil(total / limit), data };
}

const getBookById = (id) => collection().findOne({ _id: toObjectId(id) });

async function createBook(payload) {
  const doc = { ...payload, createdAt: new Date() };
  const result = await collection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

async function updateBook(id, payload) {
  const result = await collection().findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: { ...payload, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
}

const deleteBook = (id) => collection().findOneAndDelete({ _id: toObjectId(id) });

// Advanced: the aggregation from mongosh/03-aggregation.js, called from Node
const statsByCategory = () =>
  collection().aggregate([
    { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'cat' } },
    { $unwind: '$cat' },
    { $group: { _id: '$cat.name', total: { $sum: 1 }, avgPrice: { $avg: '$price' },
                stockValue: { $sum: { $multiply: ['$price', '$quantity'] } } } },
    { $sort: { total: -1 } }
  ]).toArray();

// Advanced: join book -> author -> category in one call
const getBookWithRelations = (id) =>
  collection().aggregate([
    { $match: { _id: toObjectId(id) } },
    { $lookup: { from: 'authors', localField: 'authorId', foreignField: '_id', as: 'author' } },
    { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
    { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
  ]).next();

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook, statsByCategory, getBookWithRelations };
