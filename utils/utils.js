const { chain, has } = require("lodash");


 const getCategories = (list) => {
   const findPath = list.find(l => has(l, 'path_from_root'));
   let categories = [];
   if(findPath) {
    categories = chain(list[0].path_from_root).map(item=> item.name).value();
   } else {
     categories = chain(list).orderBy(['results', ['desc']]).map(item=> item.name).value();
   }
   return categories;
 };

 module.exports = {
  getCategories,
};