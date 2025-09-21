const express = require('express');
const router = express.Router();

const Recipes = require("../models/recipe");
const User = require('../models/user');
const { route } = require('./auth');

router.get('/', async (req, res) => {
    try {
        const ownerId =  req.session.user._id;
        const populatedRecipes = await Recipes.find({owner:ownerId}).populate('owner');
        res.render('recipes/index.ejs', {recipes: populatedRecipes});
        
    } catch (error){
        console.log(error);
        res.redirect('/');
    }
});

router.get('/new', (req,res) => {
    res.render('recipes/new.ejs')
});

router.post('/', async (req,res) => {

    try {
        req.body.owner = req.session.user._id;
        await Recipes.create(req.body);
        res.redirect('/recipes');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:recipeId', async (req,res) => {
    try {
        const populatedRecipes = await Recipes.findById(req.params.recipeId).populate("owner");
        res.render('recipes/show.ejs', {
            recipe: populatedRecipes,
        });
    } catch (error) {
        console.log(error)
        res.redirect('/');
    }
});

module.exports = router;

