const fs = require("fs");

function readBooks(callback) {
    fs.readFile(
        "books.json",
        "utf8",
        (err, data) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, JSON.parse(data));
        }
    );
}

function writeBooks(books, callback) {
    fs.writeFile(
        "books.json",
        JSON.stringify(books, null, 2),
        (err) => {
            callback(err);
        }
    );

}

module.exports = {
    readBooks,
    writeBooks
};