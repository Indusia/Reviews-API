const db = require("../db");

module.exports.getReviewsByID = product_id => {
  return db.any(
    `SELECT * FROM reviews WHERE product_id = ${product_id} AND reported = false`
  );
};

module.exports.getPhotosByReview = review_id => {
  return db.any(`SELECT * FROM photos WHERE review_id = ${review_id}`);
};

module.exports.reportReview = review_id => {
  return db.any(`UPDATE reviews SET reported = true WHERE id = ${review_id}`);
};

module.exports.markHelpful = review_id => {
  return db.any(
    `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id}`
  );
};

module.exports.addReview = review => {
  return db.any();
};
