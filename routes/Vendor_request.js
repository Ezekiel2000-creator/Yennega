const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var Cart  = require('../Schema/Cart');
const Customer = require('../Schema/Customer_table');
const vendorRequest = require('../Schema/Vendor_request');
const vendor = require('../Schema/Vendor');
const Product = require('../Schema/Product_table');

async function getVendors() {

  try {

    const vendor_Requests = await vendorRequest.find();

    return vendor_Requests;

  } catch (error) {
    throw error;
  }

}
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
    res.status(401).redirect("/signin");
    }
};
const requireVendor = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    req.session.returnTo = req.originalUrl;
    return res.status(401).redirect("/signin");
  }
  
  try {
    const decodedToken = jwt.verify(token, 'your_secret_key');
    req.user = decodedToken;
    
    const user = await mongoose.model('Customer').findOne({ _id: req.user.id });
    if (!user.isVendor) {
      return res.status(403).json({ message: 'Forbidden: User is not a vendor' });
    }
    
    const products = await mongoose.model('Product').find({ Pro_vendor: user._id });
    req.user.products = products;
    
    const userCart = await Cart.findOne({ user: req.user.id }).populate('items');
    if (userCart === null || userCart.items === 0) {
      const carts = [];
      app.locals.carts = carts;
    }
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).redirect("/signin");
    } else {
      return res.status(401).json({ message: 'Token invalide' });
    }
  }
};
router.get('/data_display', async (req, res) => {
  try {
    // Utilisez la méthode .find() pour récupérer les données de VendorRequest et utilisez .populate() pour peupler le champ "user"
    const vendor_Requests = await vendorRequest.find().populate('user').sort({ dateField: -1 }).exec();
    console.log("vvvvvvvvvvvvvv", vendor_Requests); 

    res.render('Vendorequest_display', { vendor_Requests });
  } catch (err) {
    console.error("Erreur lors de l'affichage des données : ", err);
    res.status(500).send(err);
  }
});


router.get('/show/:id', async (req, res) => {

    try {
      var id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('ID non valide');
      }
      const vendor_Request = await vendorRequest.findOne({
        _id:  mongoose.Types.ObjectId(id)
      }).populate('user').exec();
      console.log('vvvvvvvvvvvvv',vendor_Request);
      
      res.render('Vendorequest_singledata', {
          vendor_Request
      });
  
    } catch (err) {
      res.status(500).send(err);
    }
});

router.get('/download/commerce/:id', async (req, res) => {
  try {
    const vendor_Request = await vendorRequest.findById(req.params.id);
    const file = vendor_Request.commerceRegisterFile;
    res.download(file); // Set disposition and send it.
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/download/idcard/:id', async (req, res) => {
  try {
    const vendor_Request = await vendorRequest.findById(req.params.id);
    const file = vendor_Request.idCardFile;
    res.download(file); // Set disposition and send it.
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/validate/:id', async (req, res) => {
  try {
    // Récupérer l'enregistrement de VendorRequest
    const vendor_Request = await vendorRequest.findById(req.params.id).populate('user');
    console.log(vendor_Request,'premier plan okkkkkkkkkk')
    // Créer un nouvel enregistrement de Vendor
    const newVendor = new vendor({
      user: vendor_Request.user._id,
      companyName: vendor_Request.name,
      address: vendor_Request.user.Customer_address,
      phoneNumber: vendor_Request.phone,
    });
    try {
      vendeur = await newVendor.save();
    } catch (err) {
      throw err;
    }
    console.log('deuxième plan okkkkkkkkkk')
    // Mettre à jour le champ request_state sur "validated" pour VendorRequest
    await vendorRequest.findByIdAndUpdate(vendor_Request._id, { request_state: 'validated' });

    // Récupérer l'enregistrement de Customer et définir le champ isVendor à true
    await Customer.findByIdAndUpdate(vendor_Request.user._id,
      { isVendor: true }
    );

    // Envoyer une réponse de succès
    res.status(200).json({ message: 'La demande du vendeur a été validée avec succès' });
  } catch (err) {
    // Gérer les erreurs
    res.status(500).json({ message: 'Une erreur est survenue lors de la validation de la demande du vendeur', error: err });
  }
});

router.post('/reject/:id', async (req, res) => {
  try {
    // Récupérer l'enregistrement de VendorRequest
    const vendor_Request = await vendorRequest.findById(req.params.id).populate('user');
    console.log(vendor_Request,'premier plan okkkkkkkkkk')
    await vendorRequest.findByIdAndUpdate(vendor_Request._id, { request_state: 'rejected' });
    res.status(200).json({ message: 'La demande du vendeur a été rejetée avec succès' });
  } catch (err) {
    // Gérer les erreurs
    res.status(500).json({ message: 'Une erreur est survenue lors de la validation de la demande du vendeur', error: err });
  }
});

router.post('/fall/:id', async (req, res) => {
  try {
    // Récupérer l'enregistrement de VendorRequest
    const vendor_Request = await vendorRequest.findById(req.params.id).populate('user');

    // Vérifier si l'enregistrement existe
    if (!vendor_Request) {
      return res.status(404).json({ message: 'L\'enregistrement du vendeur n\'a pas été trouvé' });
    }

    // Supprimer l'enregistrement de VendorRequest
    // const products = await Product.find().populate('Pro_vendor')
    const products = await Product.find({Pro_vendor:vendor_Request.user._id});
    await Product.deleteMany({_id: { $in: products.map(function(product) { return product._id; })}});
    
    await vendorRequest.findByIdAndRemove(vendor_Request._id);

    // Mettre à jour le champ request_state sur "rejected" pour VendorRequest (peut-être optionnel)
    await vendorRequest.findByIdAndUpdate(vendor_Request._id, { request_state: 'rejected' });

    // Récupérer l'enregistrement de Customer et définir le champ isVendor à false
    await Customer.findByIdAndUpdate(vendor_Request.user._id, { isVendor: false });

    // Envoyer une réponse de succès
    res.status(200).json({ message: 'La demande du vendeur a été rejetée avec succès' });
  } catch (err) {
    // Gérer les erreurs
    res.status(500).json({ message: 'Une erreur est survenue lors du rejet de la demande du vendeur', error: err });
  }
});

router.get('/my_dashboard',requireVendor, async (req, res) => {
  
  try {

    const userID = req.user ? req.user.id : undefined;
    console.log('userrrrrrrrr',userID)
    const products = req.user.products;
    console.log('Produitsssssssss',products)
    // Récupérer le customer correspondant à l'utilisateur
    let customer;
    if(userID) {
      customer = await Customer.findById(userID);
      console.log('userrrrrrrrr',customer)
    }

    // Récupérer tous les customers
    const customer_array = await Customer.find();

    res.render('dashboard', {
      customer,
      customer_array,
      products,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error occuring');
  }

});
router.get('/my_products',requireVendor, async (req, res) => {
  const products = products;

  try {

    const userID = req.user ? req.user.id : undefined;
    console.log('userrrrrrrrr',userID)

    // Récupérer le customer correspondant à l'utilisateur
    let customer;
    if(userID) {
      customer = await Customer.findById(userID);
      console.log('userrrrrrrrr',customer)
    }

    // Récupérer tous les customers
    const customer_array = await Customer.find();

    res.render('dashboard', {
      customer,
      customer_array,
      products
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error occuring');
  }

})
module.exports = router;