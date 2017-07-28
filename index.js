const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const MONGO_URL = `mongodb://${process.env.DB}:${process.env.DB_PORT}/hackaton`;
const MONGO_COLLECTION = "results";

const insertResult = function(obj, db, callback) {
  var collection = db.collection(MONGO_COLLECTION);

  collection.insert(obj, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    callback(result);
  });
};

const listResults = function(db, callback) {
  var collection = db.collection(MONGO_COLLECTION);

  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

app.get("/", function(req, res) {
  res.sendFile("form.htm", { root: __dirname });
});

app.post(
  "/result",
  upload.fields([
    { name: "code", maxCount: 1 },
    { name: "results", maxCount: 1 }
  ]),
  function(req, res) {
    MongoClient.connect(MONGO_URL, function(err, db) {
      console.log("Connecting", MONGO_URL);
      assert.equal(null, err);

      insertResult(
        {
          name: req.body.name,
          challenge: req.body.challenge,
          code: req.files.code[0].filename,
          code_original_name: req.files.code[0].originalname,
          results: req.files.results[0].filename,
          results_original_name: req.files.results[0].originalname,
          time: Math.floor(Date.now() / 1000),
          city: "delhi"
        },
        db,
        function() {
          db.close();
          res.sendFile("thankyou.htm", { root: __dirname });
        }
      );
    });
  }
);

app.get("/submissions", function(req, res) {
  MongoClient.connect(MONGO_URL, function(err, db) {
    assert.equal(null, err);
    listResults(db, function(results) {
      db.close();
      res.json(results);
    });
  });
});

app.listen(8082, function() {
  console.log("Server started on port 8082");
});
