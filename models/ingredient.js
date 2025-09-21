const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

});

const Ingredients = mongoose.model('Ingredients', ingredientSchema);
module.exports = Ingredients;