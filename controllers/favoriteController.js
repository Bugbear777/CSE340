const utilities = require("../utilities/")
const favoriteModel = require("../models/favorite-model")

/* ****************************************
 * Build favorites view
 * *************************************** */
async function buildFavorites(req, res, next) {
  const nav = await utilities.getNav()

  // must be logged in
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to view saved vehicles.")
    return res.status(401).render("account/login", { title: "Login", nav, errors: null })
  }

  const account_id = res.locals.accountData.account_id
  const favorites = await favoriteModel.getFavoritesByAccountId(account_id)

  res.render("account/favorites", {
    title: "Saved Vehicles",
    nav,
    errors: null,
    favorites,
  })
}

/* ****************************************
 * Add favorite (POST)
 * *************************************** */
async function addFavorite(req, res, next) {
  // must be logged in
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to save vehicles.")
    return res.redirect("/account/login")
  }

  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  // prevent duplicates gracefully
  const already = await favoriteModel.isFavorite(account_id, inv_id)
  if (already) {
    req.flash("notice", "That vehicle is already in your saved list.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  await favoriteModel.addFavorite(account_id, inv_id)
  req.flash("notice", "Vehicle saved!")
  return res.redirect(`/inv/detail/${inv_id}`)
}

/* ****************************************
 * Remove favorite (POST)
 * *************************************** */
async function removeFavorite(req, res, next) {
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  await favoriteModel.removeFavorite(account_id, inv_id)
  req.flash("notice", "Vehicle removed from saved list.")
  return res.redirect("/account/favorites")
}

module.exports = {
  buildFavorites,
  addFavorite,
  removeFavorite,
}
