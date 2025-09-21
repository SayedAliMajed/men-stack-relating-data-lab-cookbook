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

// show page
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

// delete option 

router.delete('/:recipeId', async (req,res) => {
    try {
        const recipe = await Recipes.findById(req.params.recipeId);
        if(recipe.owner.equals(req.session.user._id)) {
            await recipe.deleteOne();
            res.redirect('/recipes');
        } else {
            console.log('permission denied')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');

    }
});

router.get('/:recipeId/edit', async (req,res) => {
    try {
        const currentRecipe = await Recipes.findById(req.params.recipeId);
        res.render('recipes/edit.ejs')

    } catch(error) {
        console.log(error);
        res.redirect('/')
    }
})


module.exports = router;

