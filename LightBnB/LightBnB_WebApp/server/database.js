const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const res = require('express/lib/response');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {

  return pool.query(`SELECT * FROM users WHERE email = $1`,[email])
  .then((result) => result.rows[0])
  .catch((err) => {console.log(err.message)});
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool.query(`SELECT * FROM users WHERE id = $1`,[id])
  .then((result) => result.rows[0])
  .catch((err) => {console.log(err.message)});
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  (user) => {

  return pool.query(`INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *;` ,[user.name,user.email,user.password])
  .then((result) => result)
  .catch((err) => {console.log(err.message)});
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  return pool.query(`SELECT * FROM reservations 
  JOIN properties ON reservations.property_id = properties.id 
  WHERE guest_id = $1 AND start_date > NOW()::DATE LIMIT $2`,[guest_id,limit])
  .then((result) => {console.log (result.rows); return result.rows})
  .catch((err) => {console.log(err.message)});
 }
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city && options.minimum_price_per_night && options.maximum_price_per_night && options.minimum_rating && options.owner_id) {
    queryParams.push(`%${options.city}%`);
    queryParams.push(`${options.minimum_price_per_night}`);
    queryParams.push(`${options.maximum_price_per_night}`);
    let Rating = Number(options.minimum_rating);
    queryParams.push(Rating);
    queryParams.push(options.owner_id)
    queryString += `WHERE city LIKE $${queryParams.length - 4} 
    AND cost_per_night BETWEEN $${queryParams.length - 3} AND $${queryParams.length - 2}
    AND rating > $${queryParams.length - 1}
    AND owner_id = $${queryParams.length}`;
  } else if (options.city && options.minimum_price_per_night && options.maximum_price_per_night && options.minimum_rating) {
    queryParams.push(`%${options.city}%`);
    queryParams.push(`${options.minimum_price_per_night}`);
    queryParams.push(`${options.maximum_price_per_night}`);
    let Rating = Number(options.minimum_rating);
    queryParams.push(Rating);
    queryString += `WHERE city LIKE $${queryParams.length - 3} 
    AND cost_per_night BETWEEN $${queryParams.length - 2} AND $${queryParams.length - 1}
    AND rating > $${queryParams.length}`;
  } else if (options.city && options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`%${options.city}%`);
    queryParams.push(`${options.minimum_price_per_night}`);
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `WHERE city LIKE $${queryParams.length - 2} 
    AND cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
  } else if (options.city && options.minimum_price_per_night) {
    queryParams.push(`%${options.city}%`);
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `WHERE city LIKE $${queryParams.length - 1} AND cost_per_night > $${queryParams.length}`;
  } else if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);

 }
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
