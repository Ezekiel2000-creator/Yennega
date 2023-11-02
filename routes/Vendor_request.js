const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

const Customer = require('../Schema/Customer_table');
const vendorRequest = require('../Schema/Vendor_request');
const vendor = require('../Schema/Vendor');

async function getVendors() {

  try {

    const vendor_Requests = await vendorRequest.find();

    return vendor_Requests;

  } catch (error) {
    throw error;
  }

}

router.get('/data_display', async (req, res) => {
  try {
    // Utilisez la méthode .find() pour récupérer les données de VendorRequest et utilisez .populate() pour peupler le champ "user"
    const vendor_Requests = await vendorRequest.find().populate('user').sort({ dateField: -1 }).exec();

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

module.exports = router;