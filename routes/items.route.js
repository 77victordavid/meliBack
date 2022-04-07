const { Router } = require('express');

const {query, getProduct} = require('../controllers/items.controller');
const route = Router();

route.get('/', query);
route.get('/:id', getProduct);

module.exports = route;