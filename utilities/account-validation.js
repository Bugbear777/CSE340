const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email.")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check registration data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    })
  }
  next()
}

validate.updateRules = () => {
  return [
    body("account_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Missing account id."),

    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = parseInt(req.body.account_id)

        // Get the currently stored email for this account
        const current = await accountModel.getAccountById(account_id)
        if (!current) throw new Error("Account not found.")

        // If email hasn't changed, allow it
        if (current.account_email === account_email) return true

        // Otherwise, email must be unique
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please use a different email.")
        }
        return true
      }),
  ]
}

validate.checkUpdateData = async (req, res, next) => {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      accountData: await accountModel.getAccountById(parseInt(account_id)), // for fallback prefill
    })
  }
  next()
}

validate.passwordRules = () => {
  return [
    body("account_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Missing account id."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}
validate.checkPasswordData = async (req, res, next) => {
  const nav = await utilities.getNav()
  const { account_id } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      accountData: await accountModel.getAccountById(parseInt(account_id)),
    })
  }
  next()
}

module.exports = validate
