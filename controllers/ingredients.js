const express = require('express');
const router = express.Router();

const Ingredients = require('../models/ingredient');

router.get('/', async (requestAnimationFrame, res) => {
    const ingredients = await Ingredients.find({});
    res.render('ingredients/index.ejs', {ingredient: ingredients});
});

// Create
router.post('/', async (req,res) => {
    try {
        const existing = await ingredients.findOne({name: req.body.name.toLowerCase()});
        if (existing) {
            return res.redirect('/ingredients');
        }
        await Ingredients.create({name: req.body.toLowerCase()});
        res.redirect('/ingredients');
    } catch(error){
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;