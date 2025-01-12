const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes 
*/

router.get('/', recipeController.homepage);
router.get('/main', recipeController.main);
router.get('/recipe/:id', recipeController.exploreRecipe );
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/contact', recipeController.contact);
router.post('/contact', recipeController.sendmessage);
router.get('/about', recipeController.about);
router.post('/layouts/signup', recipeController.signup);
router.post('/layouts/signin', recipeController.signin);
router.get('/login', recipeController.loginr);



 
module.exports = router;