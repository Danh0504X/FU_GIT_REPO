const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const mimeTypes = {

    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpeg"

};

const {
    readBooks,
    writeBooks
} = require("./fileHelper");
if (!fs.existsSync("logs")) {

    fs.mkdirSync("logs");

}

const server = http.createServer((req, res) => {

    const log =
        `${new Date()} ${req.method} ${req.url}\n`;

    fs.appendFile(
        "logs/access.log",
        log,
        err => {
            if (err) {
                console.log("Cannot write log");
            }
        }
    );
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
 

    if (pathname === "/about" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end("<h1>About BookNest</h1>");
    }

    else if (pathname === "/api/books") {

        if (req.method === "GET") {
            readBooks((err, books) => {
                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        message: "Cannot read books.json"
                    }));
                    return;
                }
                let result = books;
                if (query.category) {
                    result = result.filter(
                        book => book.category === query.category
                    );
                }
                if (query.limit) {
                    result = result.slice(
                        0,
                        Number(query.limit)
                    );
                }
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify(result));
            });
        }

        else if (req.method === "POST") {

            let body = "";

            req.on("data", chunk => {
                body += chunk.toString();
            });

            req.on("end", () => {

                if (!body) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        message: "Empty request body"
                    }));
                    return;
                }

                const newBook = JSON.parse(body);
                readBooks((err, books) => {

                    if (err) {
                        res.writeHead(500);
                        res.end("Cannot read books");
                        return;
                    }
                    newBook.id = books.length + 1;
                    books.push(newBook);
                    writeBooks(
                        books,
                        (err) => {
                            if (err) {
                                res.writeHead(500);
                                res.end("Cannot save books");
                                return;
                            }
                            res.writeHead(201, {
                                "Content-Type": "application/json"
                            });
                            res.end(JSON.stringify(newBook));
                        }
                    );
                });
            });
        }
        else {
            res.writeHead(405, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                message: "Method Not Allowed"
            }));
        }
    }
    else if (req.method === "GET") {


        let filePath = path.join(
            __dirname,
            "public",
            pathname
        );


        if (pathname === "/") {

            filePath = path.join(
                __dirname,
                "public",
                "index.html"
            );

        }


        console.log(filePath);
        fs.readFile(filePath, (err, data) => {


            if (err) {

                res.writeHead(404, {
                    "Content-Type": "text/html"
                });


                res.end("<h1>404 File Not Found</h1>");

                return;

            }

            const ext = path.extname(filePath);
            res.writeHead(200, {
                "Content-Type":
                    mimeTypes[ext] || "application/octet-stream"
            });

            res.end(data);
        });
    }
    else {
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.end("<h1>404 Not Found</h1>");
    }
});

server.listen(3000, () => {
    console.log("Server running at port 3000");
});