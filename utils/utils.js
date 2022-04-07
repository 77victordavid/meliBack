const { chain } = require("lodash");


 const getCategories = (list) => chain(list).orderBy(['results'], ['desc']).map(item=> item.name).value();

 module.exports = {
  getCategories,
};