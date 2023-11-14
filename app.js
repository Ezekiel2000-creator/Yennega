var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session=  require('express-session');
var fileupload=  require('express-fileupload');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const statusMonitor = require('express-status-monitor');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/Admin');
var customerRouter  = require('./routes/Customer');
var categoryRouter  = require('./routes/Category');
var subcategoryRouter  = require('./routes/subcategory');
var productRouter  = require('./routes/Product');
var inqueryRouter  = require('./routes/Inquery');
var orderRouter  = require('./routes/Order_master');
var vendorRouter  = require('./routes/Vendor');
var vendorRequestRouter  = require('./routes/Vendor_request');

var Cart  = require('./Schema/Cart');
var Customer  = require('./Schema/Customer_table');
var Product  = require('./Schema/Product_table');
var Order = require('./Schema/Order_master_table');
var Vendor = require('./Schema/Vendor');
var Rating = require('./Schema/Rating_table');
var Subcategory = require('./Schema/SubCategory_table');
const VendorRequest = require('./Schema/Vendor_request');
var Category = require('./Schema/Category_table');


var app = express();
  
// view engine setup
app.set('views', [path.join(__dirname, 'views'),
        path.join(__dirname,'/views/Admin'),
        path.join(__dirname,'/views/Customer'),
        path.join(__dirname,'/views/Category'),
        path.join(__dirname,'/views/SubCategory'),
        path.join(__dirname,'/views/Product'),
        path.join(__dirname,'/views/Orders'),
        path.join(__dirname,'/views/Vendor'),
        path.join(__dirname,'/views/Vendor_request'),
      path.join(__dirname,'/views/Inquery')]);
app.set('view engine', 'ejs');
app.use(statusMonitor());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
  cookie: { secure: true },
  }));
app.use(fileupload());
app.use('/public/vendorRequest', express.static('public/vendorRequest'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/customer', customerRouter);
app.use('/category',categoryRouter);
app.use('/subcategory',subcategoryRouter);
app.use('/product',productRouter);
app.use('/inquery',inqueryRouter);
app.use('/orders',orderRouter);
app.use('/vendor',vendorRouter);
app.use('/vendorRequest',vendorRequestRouter);

//catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const initializeUser = (req, res, next) => {
	const token = req.cookies.token;
	if (token) {
	  try {
		const decodedToken = jwt.verify(token, 'your_secret_key');
		req.user = decodedToken;
	  } catch (err) {
		console.error('Erreur lors du décodage du token :', err.message);
	  }
	}
	next();
  };

const generateRandomCode = () => {
  let code = '';
  const digits = '0123456789';
  
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits[randomIndex];
  }
  
  return code;
  }
const randomCode = generateRandomCode();
console.log(randomCode);

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  console.log("vvvvvvvvvvv",token);
  
  if (token) {
    jwt.verify(token, 'your_secret_key', (err, decodedToken) => {
      if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).redirect("/signin");
      } else {
        return res.status(401).json({ message: 'Token invalide' });
      }
      }
      req.user = decodedToken;
      try {
      const userCart = Cart.findOne({ user: req.user.id }).populate('items');
    
      if (userCart === null || userCart.items === 0) {
        const carts = [];
        app.locals.carts = carts;
      }
      } catch (error) {
      res.status(500).json({ message: error.message });
      }
      next();
    });
    } else {
    req.session.returnTo = req.originalUrl;
    res.status(401).redirect("/signin");
    }
};
const findOrCreateCart = async (userID) => {
	try {
	  let cart = await Cart.findOne({ user: userID }).populate('items');
	  console.log('cart1', cart);
	  if (!cart) {
		cart = new Cart({ user: userID, items: [] });
		await cart.save();
	  }
    else {
      console.log("okkkkkkkkkkkkk");
    }
	  return cart;
	} catch (err) {
    console.error('Erreur lors du décodage du token :', err.message);
	  // throw new Error('Une erreur s\'est produite lors de la recherche ou de la création du panier :', error);
	}
  };
const getUserCart = async (req, res, next) => {

  const userID = req.user ? req.user.id : undefined;
  
  try {
    let userCart = await findOrCreateCart(userID);


    const cartItems = userCart.items;
    const productIds = cartItems.map((item) => item.product.toString());
    const quantities = {};
  
    for (const item of cartItems) {
    quantities[item.product.toString()] = item.quantity;
    }
    
    const carts = [];
  
    for (const productId of productIds) {
    try {
      const product = await Product.findById(productId).populate("Pro_subcategory");
      carts.push({
      product,
      quantity: quantities[productId]
      });
    } catch (error) {
      console.error(error);
    }
    }
    let total = 0;

    carts.forEach(item => {
    total += item.product.Pro_rentprice * item.quantity;
    })
    
    res.locals.total = total;
    res.locals.carts = carts;
    next();
  
  } catch (error) {
    console.error(error.message);
    next();
  }
  
};
async function getVendors() {

  try {

    const vendors = await Customer.find({
      isVendor: true
    });

    return vendors;

  } catch (error) {
    throw error;
  }

}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
app.use(initializeUser);
app.use(getUserCart);

app.post('/signup', async (req, res) => {
	try {
	  console.log(req.body);
	  const { firstName, lastName, birthMonth, birthDay, birthYear, gender, email, password } = req.body;
	  const birthday = `${birthYear}-${birthMonth}-${birthDay}`;
	  const hashedPassword = await bcrypt.hash(password, 10);
	  const verify = false;
  
	  // Vérification de l'e-mail
	  const existingUser = await Customer.findOne({ Customer_email: email });
	  console.log("exist",existingUser)
	  if (existingUser) {
		  res.render('signup', { errorMessage: 'Email déjà existant' });
	  }
    const code = generateRandomCode();
	  console.log("exist",code)
	  const user = new Customer({ Customer_email:email, Customer_password: hashedPassword,
       Customer_first_name:firstName, Customer_last_name:lastName, Customer_gender:gender, Customer_dob:birthday, verify,code});
	  await user.save();
  
	  // Envoi de l'e-mail de vérification
	  const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
		  user: 'moisegpt@gmail.com',
		  pass: 'ftpk open bvor gjxf'
		}
	  });

	  const mailOptions = {
		from: 'kirouni1.0@gmail.com',
		to: email,
		subject: 'Email Verification',
		html: `<p>Bonjour ${firstName},</p><p>Nous vous prions de clique sur le lien suivant afin de vérifier votre e-mail: <a href="http://yennega.onrender.com/verify/${code}">Verifier Email</a></p>`
	  };
  
	  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.render('signup', { errorMessage: 'Echec de l\'envoi de l\'email de vérification' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.render('signup', { successMessage: 'Utilisateur créé avec succès. Veuillez vérifier votre email pour la vérification.' });
      }
    });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
});

app.get("/signup", (req, res) =>{
	res.render("signup")
});

app.get("/verify/:code", async (req, res) =>{
	const{code} = req.params;
	const user = await Customer.findOne ({code:code});
	if (user) {
		user.verify = true
		await user.save()
		res.redirect("/signin")
	}else{
		res.json("user not found")
	}
});
app.post('/signin', async (req, res) => {
  try {
    // Supprimez le cookie contenant le token
    res.clearCookie('token');

    console.log(req.body);
    const { email, password } = req.body;
    const user = await Customer.findOne({ Customer_email: email });

    if (user === null) {
      return res.render('signin', { errorMessage: 'Email ou mot de passe incorrect' });
    }

    if (user.verify) {
      const match = await bcrypt.compare(password, user.Customer_password);
      if (match) {
        const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true } );  // Stocke le jeton dans un cookie
        const returnTo = req.session.returnTo || '/accueil';
        delete req.session.returnTo;
        return res.redirect(returnTo);  // Redirige vers /accueil
      } else {
        return res.render('signin', { errorMessage: 'Email ou mot de passe incorrect' });
      }
    } else {
      return res.render('signin', { errorMessage: 'Votre compte n\'est pas encore vérifié' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});


app.get("/signin", (req, res) =>{
  res.render("signin");
});

app.get("/accueil", async (req, res) => {
	const carts = res.locals.carts
    const subcategories = await Subcategory.find();
    shuffle(subcategories);
    const randomSubcategories = subcategories.slice(0,3);
	Product.find()
    .populate("Pro_subcategory")
	.exec()
	.then ((foundProducts) => {
    console.log("foundProducts",foundProducts)
    
	res.render("index",{products:foundProducts,carts,randomSubcategories})
	})
	.catch((error) => {
		console.error('Error creating document:', error);
	  });
});

// app.post("/accueil", (req,res) =>{
// 	console.log("BOy",req.body);
// 	const newProduct = {
// 		name: req.body.name,
// 		description: req.body.description,
// 		category: req.body.category,
// 		caractéristique:req.body.description,
// 		price: req.body.price,
// 		seller: req.body.vendor,
// 	};
// 	Product.create(newProduct)
// 	  .then((result) => {
// 		console.log('Document created successfully:', result);
// 		res.redirect("accueil");
// 	  })
// 	  .catch((error) => {
// 		console.error('Error creating document:', error);
// 		res.redirect("accueil");
// 	  });

// });
// Route handler
app.get("/articles", async (req, res) => {
    const userID = req.user ? req.user.id : undefined;
    console.log("user", userID);
    const carts = res.locals.carts;
    console.log("carts", carts);
    try {
      const options = {
        page: req.query.page || 1, // Le numéro de la page
        limit: 12 // Le nombre de produits par page
      };
      const skip = (options.page - 1) * options.limit;
  
      const categoryId = req.query.categoryId;
      const subcategoryId = req.query.subcategoryId;
  
      var subcategories = await Subcategory.find().populate('_category');
      var categoriesMap = {};
      subcategories.forEach(function(subcategory) {
        var categoryId = subcategory._category._id.toString();
        if (!categoriesMap[categoryId]) {
          categoriesMap[categoryId] = {
            name: subcategory._category.cate_name,
            subcategories: []
          };
        }
        categoriesMap[categoryId].subcategories.push(subcategory);
      });
      var categories = Object.values(categoriesMap);
  
      let foundProducts;
      let query = {};
      if (req.query.query) {
        var search = req.query.query;
        query.$or = [
          { Pro_name: { $regex: req.query.query, $options: 'i' } },
          { Pro_description: { $regex: req.query.query, $options: 'i' } }
        ];
      }
      if (categoryId) {
        query['Pro_subcategory._category'] = mongoose.Types.ObjectId(categoryId);
      }
      if (subcategoryId) {
        query.Pro_subcategory = mongoose.Types.ObjectId(subcategoryId);
      }
      foundProducts = await Product.find(query)
        .skip(skip)
        .limit(options.limit)
        .populate("Pro_subcategory")
        .exec();
      const randomCategories = [];

      while(randomCategories.length < 3) {
        const random = Math.floor(Math.random() * categories.length);
        if(!randomCategories.includes(random)) {
          randomCategories.push(random); 
        }
      }

      // Filtrer les catégories correspondant aux ids
      // const randomCategoryObjects = randomCategories.map(id => {
      //   return categories.find(category => category.id === id)
      // });
      if (foundProducts.length === 0) {
        res.render("empty-search",{categories:randomCategories})
      }
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / options.limit);
  
      res.render("shop_side", {products: foundProducts, carts, totalPages, currentPage: options.page, query, categories, search});
    } catch (error) {
      console.error('Error founding products:', error);
      res.redirect("/accueil");
    }
  });
  


app.get("/articles/:id", requireAuth, async (req, res) => {
  try {
    const userID = req.user ? req.user.id : undefined;
    const carts = res.locals.carts;

    const products = await Product.findById(req.params.id).populate('Ratings');
    res.render("product-detail", { products, carts, moment });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


app.post('/add-to-cart',requireAuth, async (req, res) => {
  try {
    const { productID, quantity } = req.body;
	console.log(req.body);
    let cart = await Cart.findOne({ user: req.user.id });
	console.log("utilisateur",req.user.id);	
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    const itemIndex = cart.items.findIndex(p => p.product == productID);
    if (itemIndex > -1) {
      // Le produit existe déjà dans le panier, augmente la quantité
      const productItem = cart.items[itemIndex];
      productItem.quantity = parseInt(productItem.quantity, 10) + parseInt(quantity, 10);
      cart.items[itemIndex] = productItem;
    } else {
      // Le produit n'existe pas dans le panier, l'ajoute
      cart.items.push({ product: productID, quantity });
    }
    await cart.save();
	Product.findById(productID)
	.exec()
	.then((products) =>{
		res.status(201).render('product-detail', { isAdded : true, products } );
	})
	
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/cart', requireAuth, async (req, res) => {
	try {
		const carts = res.locals.carts;
		const total = res.locals.total;
		console.log("ccccccccaaaaaaaa",carts)
    console.log("TToooooooottttttttaaaaallllll",total)
		if(carts.length === 0) {
			res.render("empty-cart");
		}else{
			console.log("carts",carts)
			res.status(201).render('cart', { carts , total });
		}
	} catch (error) {
	res.status(500).json({ message: error.message });
	}
});	

app.delete('/cart/:productId', requireAuth, async (req, res) => {
	try {
	  const { productId } = req.params;
  
	  // Trouvez le panier correspondant à l'utilisateur actuel
	  const cart = await Cart.findOne({ user: req.user.id });
  
	  // Vérifiez si le panier existe
	  if (!cart) {
		return res.status(404).json({ message: 'Le panier n\'a pas été trouvé' });
	  }
  
	  // Trouvez l'indice du produit dans le tableau des items
	  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  
	  // Vérifiez si le produit existe dans le panier
	  if (itemIndex === -1) {
		return res.status(404).json({ message: 'Le produit n\'a pas été trouvé dans le panier' });
	  }
  
	  // Supprimez le produit du tableau des items
	  cart.items.splice(itemIndex, 1);
  
	  // Sauvegardez les modifications du panier
	  await cart.save();
  
	  res.status(200).json({ message: 'Le produit a été supprimé du panier avec succès' });
	} catch (error) {
	  console.error('Une erreur s\'est produite lors de la suppression du produit du panier:', error);
	  res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression du produit du panier' });
	}
  });

app.post("/user/checkout", requireAuth, async (req, res) => {
  try {
    const carts = res.locals.carts;
    const total = res.locals.total;
    console.log("ccccccccaaaaaaaa2",carts)
    if(carts.length === 0) {
      res.redirect("/cart");
    }else{
      console.log("carts",carts)
      res.status(201).redirect('/user/checkout');
    }
  }catch(error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/user/checkout", requireAuth, async (req, res) => {
  try {
    const carts = res.locals.carts;
    const total = res.locals.total;
    console.log("ccccccccaaaaaaaa2",carts)
    res.status(201).render('checkout', { carts , total });

  }catch(error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/empty-cart", requireAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    console.log("ccccccccccaaarrtt", cart)
    if (!cart) {
    return res.status(400).redirect({ message: "Cart not found" });
    }

    // Vider les éléments du panier
    cart.items = [];
    await cart.save();
  
    res.status(200).redirect("/cart");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  });

app.post('/place-order',requireAuth, async (req, res) => {
  const total = res.locals.total;
	// const cart = await Cart.findOne({ user: req.user.id });
  const user = req.user;
  const cart  = res.locals.carts;
  // // const customer = Customer.findById(user)
  // const customer= user.Customer_name

  // console.log("userrrrrrrrrrrrr",user)
	console.log("cartssssssssssss",cart);
  console.log("Totaaaaaaaaalllllllls",total)
  // console.log("customersssssssssssss",customer)

  try {

    // Get data from request body
    const { 
      deliveryAddress 
    } = req.body;

    // Create order
    const order = new Order({
      user: user.id,
      cart,
      date: new Date(), 
      total,
      deliveryAddress,
      status: 'pending'
    });

    // Save to database
    await order.save();
    console.log("oooooooooooooooooooooooooooooooo", cart)
    for (let item of cart) {
      await Product.findOneAndUpdate(
          { _id: item.product._id },
          { $inc: { Pro_quantity: -item.quantity } }
      );
  }

    res.status(201).json({
      message: 'Order created successfully!'
    });

  } catch (error) {
    res.status(500).json({ error }); 
  }

});

app.get("/user/dashboard", requireAuth, async (req, res) => {

  try {
    
    // Get logged in user id from request
    const userId = req.user.id;
    console.log("userRFRRRRRRRRRRRRRRRRRRR",userId);

    let vendorRequest = await VendorRequest.findOne({user: mongoose.Types.ObjectId(userId)});
    // Find Customer record by id
    let user = await Customer.findById(userId);

    // Find any Orders where user id matches
    let orders = await Order.find({user: userId});

    res.status(200).render("dashboard_custom",{
      user: user,
      orders: orders,
      moment: moment,
      vendorRequest:vendorRequest,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

app.get("/user/dash-my-order", requireAuth, async (req, res) => {

  try {

    // Get logged in user id from request
    const userId = req.user.id;

    // Find Customer record by id
    let user = await Customer.findById(userId);
    console.log("userRFRRRRRRRRRRRRRRRRRRR",user)

    // Find any Orders where user id matches
    let orders = await Order.find({user: userId});
    console.log("ordersRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",orders)

    res.status(200).render("dash-my-order",{
      user: user,
      orders: orders,
      moment: moment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

app.get("/user/dash-my-profile", requireAuth, async (req, res) => {

  try {

    // Get logged in user id from request
    const userId = req.user.id;

    // Find Customer record by id
    let user = await Customer.findById(userId);
    console.log("userRFRRRRRRRRRRRRRRRRRRR",user)

    // Find any Orders where user id matches
    let orders = await Order.find({user: userId});
    console.log("ordersRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",orders)

    res.status(200).render("dash-my-profile",{
      user: user,
      orders: orders,
      moment: moment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});
app.get("/user/dash-edit-profile", requireAuth, async (req, res) => {

  try {

    // Get logged in user id from request
    const userId = req.user.id;

    // Find Customer record by id
    let user = await Customer.findById(userId);
    console.log("userRFRRRRRRRRRRRRRRRRRRR",user)

    // Find any Orders where user id matches
    let orders = await Order.find({user: userId});
    console.log("ordersRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",orders)

    res.status(200).render("dash-edit-profile",{
      user: user,
      orders: orders,
      moment: moment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});
app.post('/updateCustomer', (req, res) => {
  // Récupérez les informations du formulaire
  const { Customer_id, Customer_first_name, Customer_last_name, day, month, year, Customer_gender } = req.body;

  // Vérifiez si la date est valide
  if (!moment(`${day}-${month}-${year}`, 'DD-MM-YYYY').isValid()) {
      return res.status(400).send('Invalid date');
  }

  // Créez un objet Date à partir des informations du formulaire
  const Customer_dob = new Date(year, month - 1, day);

  // Mettez à jour le client dans la base de données
  Customer.findOneAndUpdate({ Customer_id }, { Customer_first_name, Customer_last_name, Customer_dob, Customer_gender }, { new: true }, (err, customer) => {
      if (err) {
          return res.status(500).send(err);
      }
      console.log("cccccccccccccccccccccccccccccccccccccccccccc", customer);
      res.status(200).send(customer);
  });
});

app.post("/reviews", requireAuth, async (req, res) => {
  try {
    const newReview = new Rating({
      name: req.body.name,
      score: req.body.rating,
      comment: req.body.comment,
      date: new Date(),
      user: req.user.id,
      Product: req.body.product_id,
    });
    const savedReview = await newReview.save();

    const product = await Product.findById(req.body.product_id);
    product.Ratings.push(savedReview._id);
    await product.save();

    const ratings = await Rating.find({ Product: req.body.product_id });
    const totalScore = ratings.reduce((total, rating) => total + rating.score, 0);
    const averageScore = totalScore / ratings.length;
    
    product.Rate = averageScore;
    await product.save();

    console.log("Un nouveau commentaire a été fait par un client")
    res.status(201).json({
      message: 'Review created successfully!',
      review: savedReview,
      product
    });
  } catch (error) {
    res.status(500).json({ error }); 
  }
});
app.get("/vendor/request", requireAuth, async (req, res) => {
    try {

        // Get logged in user id from request
        const userId = req.user.id;
        
        // Find Customer record by id
        let user = await Customer.findById(userId);
        console.log("userRFRRRRRRRRRRRRRRRRRRR",user)
    
        // Find any Orders where user id matches
        let orders = await Order.find({user: userId});
        console.log("ordersRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",orders)
    
        res.status(200).render("Vendor_request",{
          user: user,
          orders: orders,
          moment: moment,
        });
    
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  
  });
app.post("/vendor/request", requireAuth, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  var user = req.user.id;
  let idCardFile = req.files.idCardFile;
  let commerceRegisterFile = req.files.commerceRegisterFile;

  // Vous pouvez utiliser la méthode mv() pour déplacer le fichier vers un répertoire spécifique sur votre serveur
  idCardFile.mv('public/Vendor_request/' + idCardFile.name, function(err) {
    if (err) return res.status(500).send(err);
  });

  commerceRegisterFile.mv('public/Vendor_request/' + commerceRegisterFile.name, function(err) {
    if (err) return res.status(500).send(err);
  });

  // Créez une nouvelle instance de votre modèle avec les données reçues
  const vendorApplication = new VendorRequest({
    name: req.body.name,
    phone: req.body.phone,
    commerceRegisterNumber: req.body.commerceRegisterNumber,
    ifu: req.body.ifu,
    type: req.body.type,
    idCardFile: 'public/Vendor_request/' + idCardFile.name,
    commerceRegisterFile: 'public/Vendor_request/' + commerceRegisterFile.name,
    termsAccepted: req.body.termsAccepted,
    user: user,
    request_state: "pending",
  });

  try {
    const savedVendorApplication = await vendorApplication.save();
    res.json(savedVendorApplication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/signout', (req, res) => {
	try {
	  // Supprimez le cookie contenant le token
	  res.clearCookie('token');
	  res.redirect('/accueil'); // Redirige vers la page d'accueil ou une autre page de votre choix
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  });


//dbconnection
mongoose.Promise=global.Promise;
mongoose.connect('mongodb+srv://Ezekiel:iRds4oJ05yFpF2Qd@cluster0.hzdyy4x.mongodb.net/Yennega?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connection à MongoDB réussie !'))
.catch((error) => console.log('Connection à MongoDB échouée !', error));

app.listen(4000, () =>{
	console.log("admin",{section:"collections-create"});
});
module.exports = app;
