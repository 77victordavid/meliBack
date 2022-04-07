const axios = require("axios");
const { isEmpty } = require("lodash");
const { getCategories } = require("../utils/utils");
const query = async (req, res) => {
  try {
    console.log(req.query);
  const { q } = req.query;
  const { data } = await axios.get(
    `https://api.mercadolibre.com/sites/MLA/search?q=${q}&limit=4`
  );
  let categories = [];

  if (!isEmpty(data.filters) && data.filters.some((f) => f.id == "category")) {
    const objCategories = data.filters.find((f) => f.id == "category");
    categories = getCategories(objCategories.values);
  } else if (
    !isEmpty(data.available_filters) &&
    data.available_filters.some((f) => f.id == "category")
  ) {
    const objCategories = data.available_filters.find(
      (f) => f.id == "category"
    );
    categories = getCategories(objCategories.values);
  }

  const items = data.results.map((item) => ({
    id: item.id,
    title: item.title,
    price: {
      currency: item.prices?.presentation?.display_currency,
      amount: item.price,
      decimal: Number((item.price % 1).toFixed(2).substring(2)),
    },
    picture: item.thumbnail,
    condition: item.condition,
    free_shipping: item.shipping.free_shipping,
  }));

  const result = {
    author: {
      name: "Victor",
      lastName: "David",
    },
    categories,
    items
  };
  res.status(200).json({ ok: true, result });
  } catch (error) {
    const {status, message} = error.response.data;
    res.status(status || 500).json({message});
  }  
};

const getProduct = async (req, res) => {  
  try {    
    const {id} = req.params;
    const [item, description] = await axios.all([
      axios.get(`https://api.mercadolibre.com/items/${id}`),
      axios.get(`https://api.mercadolibre.com/items/${id}/description`)
    ]);
    const { data: dataItem } = item;
    const {data: dataDescription} = description;
    const result = {
      author: {
        name: "Victor",
        lastName: "David",
      },
      item: {
        id: dataItem.id,
        title: dataItem.title,
        price: {
          currency: dataItem.currency_id,
          amount: dataItem.price,
          decimal: Number((dataItem.price % 1).toFixed(2).substring(2))
        },
        picture: dataItem.pictures[0].url,
        condition: dataItem.condition,
        free_shipping: dataItem.shipping.free_shipping,
        sold_quantity: dataItem.sold_quantity,
        description: dataDescription.plain_text
      }
    }
    res.status(200).json({ ok: true, result });
  } catch (error) {
    console.log('####: ', error.response.data)
    const {status, message} = error.response.data;
    res.status(status || 500).json({message});
  }
};

module.exports = {
  query,
  getProduct,
};
