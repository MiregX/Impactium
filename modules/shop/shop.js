const { getUserDataByToken, getLanguagePack, log, getShopItemList } = require('../../utils');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

router.get('/', (request, response) => {
  const products = getShopItemList();

  const shopTemplate = fs.readFileSync('views/shop/item-list.ejs', 'utf8');
  const renderedShopTemplate = ejs.render(shopTemplate);
  response.render('shop/template.ejs', {
    body: renderedShopTemplate,
    products
  });
});

module.exports = router;