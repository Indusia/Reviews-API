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

module.exports = router;
