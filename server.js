const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const api = require('./server/routes/api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', api);

app.use(express.static(path.join(__dirname, 'dist')));
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist$/index.html'));
});


const port = (process.env.NODE_ENV === 'production') ? 80 : 4000;
app.set('port', port);
http.createServer(app).listen(port, () => console.log(`Running on localhost:${port}`));
