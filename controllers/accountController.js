const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Build account management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav()

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    message: req.flash("notice")
  })
}

/* ****************************************
 *  Build account update view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  const nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  if (!res.locals.accountData) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  if (account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You are not authorized to update that account.")
    return res.redirect("/account/")
  }

  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
    account_id,
  })
}


/* ****************************************
 *  Process account info update
 * *************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  if (parseInt(account_id) !== res.locals.accountData.account_id) {
    req.flash("notice", "Unauthorized account update.")
    return res.redirect("/account/")
  }

  const updated = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updated) {
    // Refresh JWT so header/locals show updated name/email immediately
    const newToken = jwt.sign(
      {
        ...res.locals.accountData,
        account_firstname: updated.account_firstname,
        account_lastname: updated.account_lastname,
        account_email: updated.account_email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )

    const cookieOptions = { httpOnly: true, maxAge: 3600 * 1000 }
    if (process.env.NODE_ENV !== "development") cookieOptions.secure = true
    res.cookie("jwt", newToken, cookieOptions)

    req.flash("notice", "Account information updated successfully.")
  } else {
    req.flash("notice", "Account update failed.")
  }

  // Query fresh data (rubric requirement)
  const freshAccountData = await accountModel.getAccountById(parseInt(account_id))

  // Deliver management view with message + updated account info
  return res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: freshAccountData,
  })
}


/* ****************************************
 *  Process password change
 * *************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  if (parseInt(account_id) !== res.locals.accountData.account_id) {
    req.flash("notice", "Unauthorized password update.")
    return res.redirect("/account/")
  }

  let result = 0
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    result = await accountModel.updatePassword(account_id, hashedPassword)
  } catch (err) {
    console.error(err)
    result = 0
  }

  if (result) {
    req.flash("notice", "Password updated successfully.")
  } else {
    req.flash("notice", "Password update failed.")
  }

  const freshAccountData = await accountModel.getAccountById(parseInt(account_id))

  return res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: freshAccountData,
  })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, updateAccount, updatePassword }