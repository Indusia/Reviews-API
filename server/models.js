const db = require("../db");

module.exports.getReviewsByID = productId => {
  return db.any(
    `SELECT * FROM reviews 
      WHERE product_id = ${productId} 
      AND reported = false`
  );
};

module.exports.getPhotosByReview = reviewId => {
  return db.any(
    `SELECT * FROM photos 
      WHERE review_id = ${reviewId}`
  );
};

module.exports.reportReview = reviewId => {
  return db.any(
    `UPDATE reviews 
      SET reported = true 
      WHERE id = ${reviewId}`
  );
};

module.exports.markHelpful = reviewId => {
  return db.any(
    `UPDATE reviews 
      SET helpfulness = helpfulness + 1 
      WHERE id = ${reviewId}`
  );
};

module.exports.addReview = (review, productId) => {
  const recommend = review.recommend ? "1" : "0";
  let characteristicsRatingQueries = "";
  let insertPhotoQueries = "";

  // loop through all characteristics
  for (const charID in review.characteristics) {
    characteristicsRatingQueries += `
    INSERT INTO ratings (value, characteristic_id, review_id)
      SELECT  ${review.characteristics[charID]}, ${charID}, (currval('reviews_id_seq'))
      WHERE (${charID} IN 
        (SELECT id FROM characteristics 
          WHERE product_id = ${productId}));
          `;
  }

  // loop through all photos
  for (const photo of review.photos) {
    insertPhotoQueries += `
    INSERT INTO photos (url, review_id)
      VALUES ('${photo}', (currval('reviews_id_seq')));
      `;
  }

  const query = `
    BEGIN;
    LOCK TABLE reviews;
    LOCK TABLE photos;
    LOCK TABLE ratings;

    INSERT INTO reviews (rating, summary, recommend, body, reviewer_name, reviewer_email, product_id)
      VALUES (${review.rating}, '${review.summary}', ${recommend}, '${review.body}', '${review.name}', '${review.email}', ${productId});
    ${characteristicsRatingQueries}
    ${insertPhotoQueries}
    COMMIT;`;

  return db.any(query);
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
