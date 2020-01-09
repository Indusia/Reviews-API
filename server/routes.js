const router = require("express").Router();
const { dataSort } = require("./helpers");
const {
  getReviewsByID,
  getPhotosByReview,
  reportReview,
  markHelpful,
  addReview
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

router.get("/reviews/:product_id/meta", (req, res) => {});

router.post("/reviews/:product_id", (req, res) => {
  addReview()
    .then(() => {})
    .catch(() => {});
});

router.put("/reviews/helpful/:review_id", (req, res) => {
  markHelpful()
    .then(() => {})
    .catch(() => {});
});

router.put("/reviews/report/:review_id", (req, res) => {
  if (req.params.product_id > 0) {
    reportReview()
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
