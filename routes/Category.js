var express= require('express');
var router=express.Router();
var categoryModel=  require('../Schema/Category_table');

// afficher le formulaire d'ajout de catégorie
router.get('/add_category', async (req, res, next) => {
  try {
    res.render('Add_Category');
  } catch (err) {
    next(err);
  }
});

// traiter le formulaire d'ajout de catégorie
router.post('/cate_process', async (req, res, next) => {
  try {
    console.log(req.body);
    const Category_data = {
      cate_id: req.body.cate_id,
      cate_name: req.body.cate_name,
    }
    var cate_data = categoryModel(Category_data);
    await cate_data.save();
    res.redirect('/category/data_display');
  } catch (err) {
    console.log("Error");
    next(err);
  }
});

// afficher toutes les catégories
router.get('/data_display', async (req, res, next) => {
  try {
    const db_category_array = await categoryModel.find().sort({ _id: -1 });
    console.log(db_category_array);
    res.render('Display_Category', { category_array: db_category_array });
  } catch (err) {
    console.log("Error");
    next(err);
  }
});

// supprimer une catégorie
router.get('/delete/:id', async (req, res, next) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
    console.log("-------------------------");
    res.redirect('/category/data_display');
  } catch (err) {
    console.log("Error");
    next(err);
  }
});

// afficher le formulaire d'édition d'une catégorie
router.get('/edit/:id', async (req, res, next) => {
  try {
    const db_category_array = await categoryModel.findById(req.params.id);
    console.log(db_category_array);
    res.render('Category_edit', { category_array: db_category_array });
  } catch (err) {
    console.log("Error");
    next(err);
  }
});

// traiter le formulaire d'édition d'une catégorie
router.post('/edit/:id', async (req, res, next) => {
  console.log("Edit ID is" + req.params.id);
  const category_data = {
    cate_id: req.body.cate_id,
    cate_name: req.body.cate_name,
  }
  try {
    await categoryModel.findByIdAndUpdate(req.params.id, category_data);
    console.log("Record Updated");
    res.redirect('/category/data_display');
  } catch (err) {
    console.log("Error in Record Update");
    next(err);
  }
});

// afficher une catégorie
router.get('/show/:id', async (req, res, next) => {
  try {
    const db_category_array = await categoryModel.findById(req.params.id);
    console.log(db_category_array);
    res.render('Category_singledata', { category_array: db_category_array });
  } catch (err) {
    console.log("Error in single Record Fetch");
    next(err);
  }
});

module.exports = router;
