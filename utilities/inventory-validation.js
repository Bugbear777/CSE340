const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name,
    })
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),

    body("inv_year")
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be a valid number."),

    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),

    body("inv_price")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be 0 or greater."),

    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  let nav = await utilities.getNav()
  const errors = validationResult(req)

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

  if (!errors.isEmpty()) {
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: errors.array(),
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
  next()
}

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),

    body("inv_year")
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be a valid number."),

    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),

    body("inv_price")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be 0 or greater."),

    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  let nav = await utilities.getNav()
  const errors = validationResult(req)

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

  if (!errors.isEmpty()) {
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: errors.array(),
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
  next()
}


module.exports = validate
