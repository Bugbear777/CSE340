const pool = require("../database/")

/* *****************************
 * Add a favorite (save a vehicle)
 * ***************************** */
async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    RETURNING favorite_id
  `
  return pool.query(sql, [account_id, inv_id])
}

/* *****************************
 * Remove a favorite
 * ***************************** */
async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM favorites
    WHERE account_id = $1 AND inv_id = $2
    RETURNING favorite_id
  `
  return pool.query(sql, [account_id, inv_id])
}

/* *****************************
 * Get favorites for an account
 * (join inventory so we can display vehicles)
 * ***************************** */
async function getFavoritesByAccountId(account_id) {
  const sql = `
    SELECT i.*
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC
  `
  const result = await pool.query(sql, [account_id])
  return result.rows
}

/* *****************************
 * Check if a vehicle is already favorited
 * ***************************** */
async function isFavorite(account_id, inv_id) {
  const sql = `
    SELECT 1
    FROM favorites
    WHERE account_id = $1 AND inv_id = $2
    LIMIT 1
  `
  const result = await pool.query(sql, [account_id, inv_id])
  return result.rowCount > 0
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccountId,
  isFavorite,
}
