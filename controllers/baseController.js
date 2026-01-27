const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

baseController.triggerError = async function (req, res, next) {
  // This will be caught by handleErrors and sent to your error middleware
  throw new Error("Intentional 500 error triggered for testing.")
}

module.exports = baseController