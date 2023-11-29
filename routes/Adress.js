var express = require('express');
var router = express.Router();
var City = require('../Schema/Adress');

const create = async (req, res) => {
    try {
        let { city_option, city_id, new_city, 'locality_name[]': locality_names, 'delivery_cost[]': delivery_costs } = req.body;

        // Convertir en tableau si ce n'est pas le cas
        if (!Array.isArray(locality_names)) {
            locality_names = [locality_names];
        }
        if (!Array.isArray(delivery_costs)) {
            delivery_costs = [delivery_costs];
        }

        const localities = locality_names.map((name, index) => ({
            name,
            deliveryCost: { value: delivery_costs[index] },
        }));

        if (city_option === 'existing') {
            // Utiliser la ville existante
            const city = await City.findById(city_id);
            if (!city) {
                return res.status(400).render("Add_Adress",{ errorMessage: "La ville sélectionnée n'existe pas." });
            }

            city.localities.push(...localities);
            await city.save();
            const cities = await City.find();
            res.status(201).render("Display_Adress",{cities});
        } else if (city_option === 'new') {
            // Vérifier si la ville existe déjà
            const existingCity = await City.findOne({ name: new_city });
            if (existingCity) {
                return res.status(400).render("Add_Adress",{ errorMessage: "La ville existe déjà." });
            }

            // Créer une nouvelle ville
            const city = new City({ name: new_city, localities });
            await city.save();
            const cities = await City.find();
            res.status(201).redirect("/delivery/create");
        } else {
            // Option invalide
            res.status(400).render("Add_Adress",{ errorMessage: "Option de ville invalide." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





  

const update = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    const cities = await City.find();
    res.status(200).render("Display_Adress", {cities} );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Afficher la liste des lieux de livraison
router.get('/list', async (req, res) => {
    try {
      const cities = await City.find();
      res.render('Display_Adress', { cities });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/create', async (req, res) => {
    try {
      const cities = await City.find();
      res.render('Add_Adress', { cities });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
  // Afficher le détail d'une ville et de ses localités
router.get('/show/:id', async (req, res) => {
try {
    const city = await City.findById(req.params.id);
    res.render('delivery_show', { city });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});
  
// Afficher le formulaire de modification d'une ville
router.get('/edit/:id', async (req, res) => {
try {
    const city = await City.findById(req.params.id);
    res.render('delivery_edit', { city });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

// Créer une nouvelle localité de livraison
router.post('/create', create);

// Modifier une localité de livraison existante
router.patch('/update/:id', update);

// Supprimer une localité de livraison
router.get('/delete/:id', deleteCity);

module.exports = router;
