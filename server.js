var express = require("express");
var app = express();
var path = require("path");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seefoodapp",
  multipleStatements: true,
});

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/restaurants/:id", function (req, res) {
  res.sendFile(path.join(__dirname + "/restaurants.html"));
});

app.get("/api/restaurants", function (req, res) {
  connection.query(`SELECT * FROM restaurant`, function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

app.get("/api/restaurants/:id", function (req, res) {
  const id = req.params.id;

  if (id) {
    connection.query(
      `SELECT * FROM menu_items WHERE restaurant=${id}; SELECT * FROM restaurant WHERE id=${id}`,
      function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
      }
    );
  } else return;
});

app.listen(8080, () => console.log("SeeFoodApp is running on 8080"));
