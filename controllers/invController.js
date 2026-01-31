const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryById(inv_id)

  if (!data){
    // No vehicle found by that id
    const error = new Error("Vehicle not found")
    error.status = 404
    return next(error)
  }
  const detail = utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()

  res.render("inventory/detail", {
  title: `${data.inv_make} ${data.inv_model}`,
  nav,
  detail,
})

}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Deliver add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result && result.rows) {
    req.flash("notice", `Classification "${classification_name}" was added successfully.`)
    let nav = await utilities.getNav() // rebuild nav so it includes new classification immediately
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    let nav = await utilities.getNav()
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList,
    errors: null,
  })
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  // destructure all fields from req.body
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  const result = await invModel.addInventoryItem(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )

  if (result && result.rows) {
    req.flash("notice", "Inventory item added successfully.")
    nav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the inventory item failed.")
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }
}



module.exports = invCont