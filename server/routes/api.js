const database = require('../database');
const express = require('express');
const fs = require('fs');
const router = new express.Router();

const apiKey = fs.readFileSync('server/tmdbApiKey.txt', 'utf-8').trimRight();

router.get('/getTmdbApiKey', (req, res) => {
  res.status(200).send(apiKey);
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
