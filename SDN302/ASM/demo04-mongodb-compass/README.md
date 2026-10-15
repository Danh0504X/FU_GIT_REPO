# Demo 04 - MongoDB, Compass & the Node.js driver (Slot 3.2, 3.3)

Maps to **Lab 04**. This is the chapter where MongoDB Compass is taught,
so the demo ships with import-ready data and a step-by-step Compass script:
see **[COMPASS_GUIDE.md](./COMPASS_GUIDE.md)**.

| Slide content | Where to look |
|---|---|
| Serialization, what is NoSQL, what is MongoDB | `COMPASS_GUIDE.md` step 1, `mongosh/01-crud.js` |
| How to use MongoDB Shell | `mongosh/01-crud.js` ... `04-relationships.js` |
| How to use MongoDB Compass | `COMPASS_GUIDE.md` (8 steps + checklist) |
| CRUD operations | `mongosh/01-crud.js`, `src/bookRepository.js` |
| Query operators, projection, sort, paging | `mongosh/02-queries.js` |
| Aggregation | `mongosh/03-aggregation.js`, `statsByCategory()` |
| Mapping relationships (embed vs reference) | `mongosh/04-relationships.js`, `compass/booknest.books.json` |
| Install & connect MongoDB from Node | `src/db.js` |
| Execute CRUD queries with MongoDB | `src/bookRepository.js`, `src/server.js` |
| Advanced query statements | filter + sort + pagination + `$lookup` in `bookRepository.js` |

## Folder map
```
compass/    JSON files to import through Compass (Extended JSON, real ObjectIds)
mongosh/    the same operations typed in the shell - run or paste block by block
src/        the Node.js driver version: db.js, bookRepository.js, server.js
```

## How to run
```bash
npm install
cp .env.example .env
npm run import     # loads the 3 collections (same data as the Compass import)
npm run queries    # shell queries executed from Node.js
npm start          # REST API on http://localhost:3000  (see requests.http)
```

## Teaching notes
- Keep Compass open on a second screen during the whole slot; every API call must be
  visible as a document change in Compass.
- The dataset is deliberately built with `authorId` / `categoryId` references **and** an
  embedded `reviews` array, so the same collection illustrates both relationship styles.
- Do not delete the database at the end: Demo 05 and Demo 06 reuse `booknest`.
