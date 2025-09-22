const express = require('express');
const router = express.Router();

const Ingredient = require('../models/ingredient');

router.get('/', async (req, res) => {
    try {
    const ingredients = await Ingredient.find({});
    res.render('ingredients/index.ejs', {ingredients: ingredients});
    } catch(error) {
        console.log(error);
        redirect('/');
    }
});


// Create
router.post('/', async (req, res) => {
  try {
    const existing = await Ingredient.findOne({ name: req.body.name.trim().toLowerCase() });
    if (existing) {
      const redirect = req.query.redirect || '/ingredients';
      return res.redirect(redirect);
    }

    await Ingredient.create({ name: req.body.name.trim().toLowerCase() });

    const redirect = req.query.redirect || '/ingredients';
    res.redirect(redirect);
  } catch (error) {
    console.error(error);
    res.redirect('/ingredients');
  }
});


module.exports = router;