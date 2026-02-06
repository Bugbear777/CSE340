// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")



// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
// Route to build inventory detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))
// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))
// Route to deliver add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
// Route to handle add classification form submission
router.post("/add-classification", invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))
// Route to deliver add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
// Route to handle add inventory form submission
router.post("/add-inventory", invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))
// Route to deliver edit inventory view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Deliver inventory item edit view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventoryView))
// Handle inventory item update
router.post("/update/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))


module.exports = router;