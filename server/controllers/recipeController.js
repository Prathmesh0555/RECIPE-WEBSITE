require('../models/database');
const Login = require('../models/Login');
const bcrypt = require('bcrypt');
const collection = require('../models/Login'); // Example
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');



// redirecting
exports.loginr = (req, res) => {
  console.log('Rendering login page');
  res.render('login', { layout: './layouts/login' });
};
exports.main = async (req, res) => {
  try {
    const categories = await Category.find({});
    const recipes = await Recipe.find({});
    const latest = await Recipe.find({}).sort({_id: -1}).limit(5); 
    const indian = await Recipe.find({ 'category': 'Indian' }).limit(5);
    const maharastrian = await Recipe.find({ 'category': 'Maharastrian' }).limit(5);
    const american = await Recipe.find({ 'category': 'American' }).limit(5); 
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(5); 
    const food = { latest, indian, maharastrian, american, chinese };
    res.render('index', { 
      user: req.session.user, 
      categories: categories, 
      recipes: recipes, 
      food: food,
      layout: './layouts/main'
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).send("Error fetching data");
  }
};

// exports.recipeDetails = async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);
//     res.render('recipe', { 
//       user: req.session.user, 
//       recipe: recipe, 
//       layout: './layouts/main'
//     });
//   } catch (error) {
//     console.error("Error fetching recipe: ", error);
//     res.status(500).send("Error fetching recipe");
//   }
// };




// Sign up endpoint
exports.signup = async (req, res) => {
  const data = {
      name: req.body.username,
      email: req.body.email,
      password: req.body.password
  };

  try {
      const existingUser = await collection.findOne({ email: data.email });
      if (existingUser) {
          return res.status(400).send("User already exists. Please try a different email.");
      }

      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds); // Hash password

      const newUser = new Login(data);
      await newUser.save(); // Save user
      res.send("User registered successfully!");
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send("Error registering user");
  }
};

// Sign in endpoint
exports.signin = async (req, res) => {
  try {
    const user = await Login.findOne({ email: req.body.email });

   
      if (!user) {
        return res.status(404).send("User cannot be found");
      }
      console.log(req.body);
       // Add this for debugging

      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
      if (isPasswordMatch) {
       
         
      console.log('Successful signin, rendering main');
      
      req.session.user = user; // Set user session
      res.redirect('/main'); // Redirect to main page
      // { user, body: '<h1>Welcome to Recipified!</h1>'}
      } else {
          res.status(401).send("Wrong Password");
      }
  } catch (error) {
      console.error("Error during sign-in:",error); // Log the error for debugging
      res.status(500).send("Invalid Details");
  }
};

// get comment page

exports.contact= (req, res) => {
  res.render('contact'); // Render the contact.ejs file
};

// Handle form submission
exports.sendmessage = (req, res) => {
  const { firstName, lastName, email, mobile, message } = req.body;
  // Handle the message (e.g., send an email, save to database, etc.)
  res.send('Message received!'); // Respond after processing
};

// about us page

exports.about= (req, res) => {
  res.render('about'); // Render the contact.ejs file
};


/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const indian = await Recipe.find({ 'category': 'Indian' }).limit(limitNumber);
    const maharastrian = await Recipe.find({ 'category': 'Maharastrian' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, indian, maharastrian, american, chinese };

    res.render('index', { title: 'Recipified - Home', categories, food  } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Recipified - Categories', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Recipified - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Recipified - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Recipified - Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Recipified - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Recipified - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Recipified - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}




// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();

