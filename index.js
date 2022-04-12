const express = require('express');
require('dotenv').config();
var cors = require('cors');

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/items', require('./routes/items.route'));

app.listen(process.env.PORT, ()=>{
  console.log('Server running', process.env.PORT);
});