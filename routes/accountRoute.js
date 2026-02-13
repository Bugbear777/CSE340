const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const favoriteController = require("../controllers/favoriteController")


// Account management (default) route
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Deliver login view (GET /account/login)
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  res.locals.loggedin = 0
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
})

router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account info update
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Favorites (Saved Vehicles)
router.get(
  "/favorites",
  utilities.checkJWTToken,
  utilities.handleErrors(favoriteController.buildFavorites)
)

router.post(
  "/favorites/add",
  utilities.checkJWTToken,
  utilities.handleErrors(favoriteController.addFavorite)
)

router.post(
  "/favorites/remove",
  utilities.checkJWTToken,
  utilities.handleErrors(favoriteController.removeFavorite)
)


module.exports = router

