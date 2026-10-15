# MongoDB Compass lab guide - Slot 3.2 / 3.3

This guide follows the slide sequence of **Slot 3.2 "NoSQL Database with MongoDB"**
(How to use MongoDB Shell and MongoDB Compass, CRUD operations, mapping relationships)
and prepares the data used by **Slot 3.3 "NodeJS with MongoDB"**.

Everything the students do in Compass has an exact counterpart in
`mongosh/` (shell) and in `src/` (Node.js driver). Show the three views side by side.

---

## Step 1. Connect

1. Open Compass, click **New connection**.
2. Local server: `mongodb://127.0.0.1:27017` then **Connect**.
   Atlas cluster: paste the `mongodb+srv://...` string - it is the same value as
   `MONGODB_URI` in `.env`, which proves that Compass, mongosh and Node.js all use one connection string.
3. In the left sidebar, click **+** next to *Databases* and create:
   - Database name: `booknest`
   - Collection name: `books`
4. Add the two other collections with **Create collection**: `authors`, `categories`.

> Slide mapping: "Databases are used to store structured information" - the sidebar shows
> Databases > Collections > Documents, the three levels of the MongoDB data model.

## Step 2. Import the sample data (instead of typing 10 documents by hand)

For each collection: open it, choose **Add Data > Import JSON or CSV file**, select

| Collection | File |
|---|---|
| `authors` | `compass/booknest.authors.json` |
| `categories` | `compass/booknest.categories.json` |
| `books` | `compass/booknest.books.json` |

Select **JSON** as the input file type and confirm.

The files use MongoDB **Extended JSON** (`{ "$oid": "..." }`), so the `_id`, `authorId`
and `categoryId` fields are imported as real `ObjectId` values and not as strings.
Open one book document and check that `authorId` is displayed with the pink `ObjectId` badge -
that is the point students must see before Slot 5.1 (Mongoose Population).

> Alternative from the terminal, same result:
> `npm run import` (uses `src/importData.js`) or
> `mongoimport --db booknest --collection books --file compass/booknest.books.json --jsonArray`

## Step 3. CRUD in the Compass user interface

| Slide item | Compass action | Shell equivalent |
|---|---|---|
| Insert | **Documents > ADD DATA > Insert document** | `db.books.insertOne({...})` |
| Read | the document list of the collection | `db.books.find()` |
| Update | hover a document > pencil icon > edit > **Update** | `db.books.updateOne(...)` |
| Delete | hover a document > trash icon > **Delete** | `db.books.deleteOne(...)` |
| Clone | copy icon, then change the title | `insertOne` with a modified copy |

Exercise: insert one book through the UI, then run `db.books.countDocuments()`
in the **MONGOSH** panel at the bottom of Compass and see the number change.

## Step 4. Queries - the FILTER bar

Paste these filters into the green **Filter** bar of the `books` collection.
They are the same objects as in `mongosh/02-queries.js`.

```js
{ price: { $gt: 400000 } }
{ price: { $gte: 300000, $lte: 500000 } }
{ tags: { $all: ["mongodb", "nosql"] } }
{ title: { $regex: "mongo", $options: "i" } }
{ $or: [ { tags: "javascript" }, { tags: "mongodb" } ] }
{ "reviews.rating": { $gte: 5 } }
{ inStock: false }
```

Click **Options** to reveal the extra boxes and demonstrate that
**Project / Sort / Skip / Limit** are exactly `find().project().sort().skip().limit()`:

- Project: `{ title: 1, price: 1, _id: 0 }`
- Sort: `{ price: -1 }`
- Skip: `3`  Limit: `3`   (this is page 2 with 3 books per page)

## Step 5. Schema, Explain Plan and Indexes

- **Schema tab > Analyze Schema**: Compass samples the collection and shows the type and
  the value distribution of every field. Use it to explain "schema-free does not mean structure-free"
  and to justify why Mongoose adds a schema in Slot 4.1.
- **Explain Plan tab**: run `{ price: { $gt: 400000 } }` and read `COLLSCAN` (full scan).
- **Indexes tab > Create Index** on `price: -1`, run the query again, and read `IXSCAN`.
  Same result as `db.books.find(...).explain('executionStats')`.
- Create a **text** index on `title` and `tags` to support the keyword search used by the API.

## Step 6. Aggregations tab

Open **Aggregations > Add Stage** and rebuild pipeline 2 of `mongosh/03-aggregation.js`:

1. `$lookup` - from `categories`, localField `categoryId`, foreignField `_id`, as `category`
2. `$unwind` - path `$category`
3. `$project` - `{ title: 1, price: 1, category: "$category.name", _id: 0 }`
4. `$sort` - `{ price: -1 }`

Compass previews the output of each stage. Then use **Export to language > Node.js**
and compare the generated code with `statsByCategory()` in `src/bookRepository.js`.

> This is the clearest way to show the slide statement "MongoDB does not have joins" -
> `$lookup` is how a join is expressed, and Mongoose `populate()` (Slot 5.1) is the ODM shortcut.

## Step 7. Relationships - embedded vs referenced

In the `books` collection, open the document *Clean Code*:

- `reviews` is an **embedded array**: the reviews are inside the book document.
- `authorId` and `categoryId` are **references**: only the `ObjectId` is stored.

Copy the `authorId` value, open the `authors` collection and filter with
`{ _id: ObjectId("660000000000000000000002") }` to find the related author manually.
Ask the students how many round trips the application needed - that is exactly the cost
`populate()` will hide in Slot 5.1.

## Step 8. Connect Node.js to the same data (Slot 3.3)

```bash
cp .env.example .env      # keep MONGODB_URI identical to the Compass connection string
npm install
npm run queries           # the queries of step 4, executed by the Node.js driver
npm start                 # REST API on http://localhost:3000
```

Create a book with `POST /api/books` (see `requests.http`), then press the refresh
button in Compass: the new document appears. Delete it in Compass and call
`GET /api/books` again: it is gone. The loop Compass <-> shell <-> API is the take-away of these two slots.

## Checklist for the lab report

- [ ] Screenshot of the connection and of the three collections with their document counts
- [ ] Screenshot of an insert / update / delete done in the Compass UI
- [ ] Screenshot of the Filter bar with a `$regex` query and the Options boxes filled in
- [ ] Screenshot of the Schema tab and of the Explain Plan before and after creating the index
- [ ] Screenshot of the aggregation pipeline and of the exported Node.js code
- [ ] Screenshot of a document created by the API and displayed in Compass
