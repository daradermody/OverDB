const express = require('express');
const router = express.Router();

// Connect
//TODO: Connect to Neo4j
// const connection = (closure) => {
//     return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
//         if (err) return console.log(err);
//
//         closure(db);
//     });
// };

// Error handling
const sendError = (err, res) => {
  "use strict"
  res.status = 501;
  res.message = typeof err === 'object' ? err.message : err;
  res.status(501).json(res);
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
