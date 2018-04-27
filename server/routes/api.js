const express = require('express');
const router = new express.Router();

// TODO: Connect to Neo4j
// TODO: Fill database with info from developers.themoviedb.org (e.g. see /3/people/get-person-movie-credits)
// const connection = (closure) => {
//     return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
//         if (err) return console.log(err);
//
//         closure(db);
//     });
// };

router.get('/filmList', (req, res) => {
  res.json([
    {
      'title': 'titleaaa',
      'tagline': 'tagline1',
      'released': 'released1',
    }, {
      'title': 'titleb',
      'tagline': 'tagline2',
      'released': 'released2',
    }, {
      'title': 'titlec',
      'tagline': 'tagline3',
      'released': 'released3',
    }, {
      'title': 'titlee',
      'tagline': 'tagline4',
      'released': 'released4',
    },
  ]);

  // TODO: Use actual database
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
