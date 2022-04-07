const axios = require("axios");
const { isEmpty } = require("lodash");
const { getCategories } = require("../utils/utils");
const query = async (req, res) => {
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
};

const getProduct = async (req, res) => {
  console.log(req);
  res.status(200).json({ ok: true, text: "getProduct" });
};

module.exports = {
  query,
  getProduct,
};
