const express = require('express');
const router = express.Router();

const Recipes = require("../models/recipe");
const Ingredients = require('../models/ingredient');
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

router.get('/new', async (req, res) => {
  try {
    const ingredients = await Ingredients.find({});
    res.render('recipes/new', { ingredients });
  } catch (error) {
    console.error(error);
    res.redirect('/recipes');
  }
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

// Edit
router.get('/:recipeId/edit', async (req,res) => {
    try {
        const currentRecipe = await Recipes.findById(req.params.recipeId);
        res.render('recipes/edit.ejs', { recipe: currentRecipe})

    } catch(error) {
        console.log(error);
        res.redirect('/')
    }
});

router.put('/:recipeId', async (req,res) => {
    try {
        const currentRecipe = await Recipes.findById(req.params.recipeId);
        if (currentRecipe.owner.equals(req.session.user._id)) {
            Object.assign(currentRecipe, req.body);
            await currentRecipe.save();
            res.redirect(`/recipes/${req.params.recipeId}`);
        } else {
            console.log('Permission denied')
        }

    } catch(error) {
        console.log(error);
        res.redirect('/');
    }
});


module.exports = router;

