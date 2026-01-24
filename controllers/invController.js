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

module.exports = invCont