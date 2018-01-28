const express = require('express');
const router = express.Router();

// Connect
//TODO: Connect to Neo4j
//TODO: Fill database with info from developers.themoviedb.org (e.g. see /3/people/get-person-movie-credits)
// const connection = (closure) => {
//     return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
//         if (err) return console.log(err);
//
//         closure(db);
//     });
// };

// Error handling
const sendError = (err, res) => {
  "use strict";
  res.status = 501;
  res.message = typeof err === 'object' ? err.message : err;
  res.status(501).json(res);
};

const errorMessageExample = {
  "developerMessage": "Verbose, plain language description of the problem. Provide developers suggestions about how to solve their problems here",
  "userMessage": "This is a message that can be passed along to end-users, if needed.",
  "errorCode": "444444",
  "moreInfo": "http://www.example.gov/developer/path/to/help/for/444444, http://tests.org/node/444444"
};

//
// Response handling
let res = {
  status: 200,
  data: [],
  message: null
};

// Get users
router.get('/filmList', (req, res) => {
  res.json([
    {
      "title": "titleaaa",
      "tagline": "tagline1",
      "released": "released1"
    },
    {
      "title": "titleb",
      "tagline": "tagline2",
      "released": "released2"
    },
    {
      "title": "titlec",
      "tagline": "tagline3",
      "released": "released3"
    },
    {
      "title": "titlee",
      "tagline": "tagline4",
      "released": "released4"
    }
  ]);

  //TODO: Use actual database
  // connection((db) => {
  //     db.collection('users')
  //       .find()
  //       .toArray()
  //       .then((users) => {
  //         response.data = users;
  //         res.json(response);
  //       })
  //       .catch((err) => {
  //         sendError(err, res);
  //       });
  // });
});

module.exports = router;
