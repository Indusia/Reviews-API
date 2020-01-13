const router = require("express").Router();
const {
  dataSort,
  countRAndR,
  parseCharacteristics,
  isDataValid
} = require("./helpers");
const {
  getReviewsByID,
  getPhotosByReview,
  reportReview,
  markHelpful,
  addReview,
  getRAndR,
  getAverageRatings
} = require("./models");

/* The route gathers review data of a product and sends it back.

Sorting options: Newest, Helpfulness, Relevance; Default is Relevance

Data sent back:
product_id - The number of the product
page - The page of the reviews searched for
count - The number of reviews listed on each page
results - All the reviews found within the range of the page/count

For each review: 
review_id - Based on the database entry
rating - A number between 1-5
summary - A quick summary/title of the review
recommend - If the product was recommended by the user
response - A response to the review, from the seller
body - The text of the review
date - The date the review was submitted
reviewer_name - The username of the reviewer
helpfulness - The number of times the review was marked helpful
photos - An array of all the photo: ID, URL */

router.get("/reviews/:product_id/list", (req, res) => {
  if (req.params.product_id > 0) {
    const page = req.query.page || 0;
    const count = req.query.count || 5;
    const startIndex = page * count;
    const endIndex = startIndex + count - 1;
    const sortBy =
      req.query.sort === "newest" ||
      req.query.sort === "helpful" ||
      req.query.sort === "relevant"
        ? req.query.sort
        : "relevant";

    getReviewsByID(req.params.product_id)
      .then(data => {
        const reviewData = [];
        dataSort(data, sortBy);

        for (let i = startIndex; i < endIndex && i < data.length; i++) {
          const review = data[i];

          if (review !== undefined) {
            reviewData.push({
              review_id: review.id,
              rating: review.rating,
              summary: review.summary,
              recommend: review.recommend,
              response: review.response,
              body: review.body,
              date: review.date,
              reviewer_name: review.reviewer_name,
              helpfulness: review.helpfulness
            });
          }
        }

        const reviewObj = {
          product: "" + req.params.product_id,
          page: page,
          count: count,
          results: reviewData
        };

        return reviewObj;
      })
      .then(reviewObj => {
        const photosToGet = [];

        for (const review of reviewObj.results) {
          photosToGet.push(getPhotosByReview(review.review_id));
        }

        Promise.all(photosToGet)
          .then(photos => {
            for (let i = 0; i < reviewObj.results.length; i++) {
              reviewObj.results[i].photos = photos[i];
            }

            res.status(200);
            res.json(reviewObj);
          })
          .catch(err => {
            // console.log(`Error: ${err}`);
            res.sendStatus(500);
          });
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(404);
  }
});

/* The Route gathers meta data, based on product ID and sends it back.

Data sent back is a JSON object with the info:

Product ID
A count of all ratings between 1-5 for the product
A count of the number of reviews that did and did't recommend the product
The characteristics of the product and average ratings for each */

router.get("/reviews/:product_id/meta", (req, res) => {
  if (req.params.product_id > 0) {
    const queries = [];
    queries.push(getRAndR(req.params.product_id));
    queries.push(getAverageRatings(req.params.product_id));

    Promise.all(queries)
      .then(results => {
        const counters = countRAndR(results[0]);
        const characteristics = parseCharacteristics(results[1]);

        const metadataObj = {
          product_id: req.params.product_id,
          ratings: counters.ratings,
          recommended: counters.recommended,
          characteristics: characteristics
        };

        res.status(200);
        res.json(metadataObj);
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(404);
  }
});

/* Checks if the data requested to be posted into the DB is valid.

The route runs a query that inserts data into the necessary tables. */

router.post("/reviews/:product_id", (req, res) => {
  if (req.params.product_id > 0 && isDataValid(req.body)) {
    addReview(req.body, req.params.product_id)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(404);
  }
});

/*  The route runs a query that increments the helpfulness counter of a review.

Helpfulness count impacts the sorting algorightms based on:
Relevance, Helpfulness */

router.put("/reviews/helpful/:review_id", (req, res) => {
  if (req.params.review_id > 0) {
    markHelpful(req.params.review_id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(404);
  }
});

/* Route runs a query that updates and marks a review as reported.

Reported reviews don't show up on any GET requests when queried. */

router.put("/reviews/report/:review_id", (req, res) => {
  if (req.params.review_id > 0) {
    reportReview(req.params.review_id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(404);
  }
});

// Required to run tests on loader.io

router.get("/loaderio-687ddfe8a063d0efb98de2928ad7eded/", (req, res) => {
  res.send("loaderio-687ddfe8a063d0efb98de2928ad7eded");
});

module.exports = router;
