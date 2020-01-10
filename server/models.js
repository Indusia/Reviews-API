const db = require("../db");

module.exports.getReviewsByID = product_id => {
  return db.any(
    `SELECT * FROM reviews 
      WHERE product_id = ${product_id} 
      AND reported = false`
  );
};

module.exports.getPhotosByReview = review_id => {
  return db.any(
    `SELECT * FROM photos 
      WHERE review_id = ${review_id}`
  );
};

module.exports.reportReview = review_id => {
  return db.any(
    `UPDATE reviews 
      SET reported = true 
      WHERE id = ${review_id}`
  );
};

module.exports.markHelpful = review_id => {
  return db.any(
    `UPDATE reviews 
      SET helpfulness = helpfulness + 1 
      WHERE id = ${review_id}`
  );
};

module.exports.addReview = review => {
  return db.any();
};

module.exports.getRAndR = product_id => {
  return db.any(
    `SELECT recommend, rating 
      FROM reviews 
      WHERE product_id = ${product_id}`
  );
};

module.exports.getAverageRatings = product_id => {
  return db.any(
    `WITH c_values as (
      WITH c as (
        SELECT id, name 
        FROM characteristics 
        WHERE product_id = ${product_id}
      )
        SELECT r.value, r.characteristic_id, c.name 
          FROM ratings AS r
          INNER JOIN c 
          ON r.characteristic_id = c.id
    )
      SELECT c_values.name, c_values.characteristic_id, to_char(AVG(value), '9D9999') AS average 
        FROM c_values 
        GROUP BY c_values.characteristic_id, c_values.name 
        ORDER BY c_values.characteristic_id;`
  );
};
