const database = require('../database');

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

router.get('/person', (req, res) => {
  try {
    res.status(200).json(database.getFollowedPeople('Dara'));
  } catch (e) {
    console.error(e);
    res.status(500).json({userMessage: 'Error getting followed people: ' + e});
  }
});


router.post('/person/add', (req, res) => {
  try {
    database.addFollowedPerson(req.body, 'Dara');
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).json({userMessage: 'Error adding followed person: ' + e});
  }
});

router.post('/person/remove', (req, res) => {
  try {
    database.removeFollowedPerson(req.body.name, 'Dara');
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).json({userMessage: 'Error removing followed person: ' + e});
  }
});

module.exports = router;
