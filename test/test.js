const assert = require("assert");
const axios = require("axios");

describe("Get request to endpoint /reviews/:product_id/list", () => {
  it("should be on page 0 and count 5 when no parameters are passed in", () => {
    axios
      .get("http://localhost:8080/reviews/2/list")
      .then(res => {
        assert.equal(res.data.product, "2");
        assert.equal(res.data.page, 0);
        assert.equal(res.data.count, 5);
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
      });
  });

  it("should receive a 200 status code when database is successfully queried", () => {
    axios
      .get("http://localhost:8080/reviews/2/list")
      .then(res => {
        assert.equal(res.status, 200);
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
      });
  });

  it("should receive a 404 status code when database is improperly queried", () => {
    axios
      .get("http://localhost:8080/reviews/NOT_NUM/list")
      .then(res => {
        assert.equal(res.status, 404);
      })
      .catch(err => {
        console.log("Error, as intended");
      });
  });
});

describe("Put request to endpoint /reviews/report/:review_id", () => {
  it("should receive a 204 status code when database is successfully queried", () => {
    axios
      .put("http://localhost:8080/reviews/report/14")
      .then(res => {
        assert.equal(res.status, 204);
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
      });
  });

  it("should receive a 404 status code when database is improperly queried", () => {
    axios
      .put("http://localhost:8080/reviews/report/NOT_NUM")
      .then(res => {
        assert.equal(res.status, 404);
      })
      .catch(err => {
        console.log("Error, as intended");
      });
  });
});

describe("Put request to endpoint /reviews/helpful/:review_id", () => {
  it("should receive a 204 status code when database is successfully queried", () => {
    axios
      .put("http://localhost:8080/reviews/helpful/1")
      .then(res => {
        assert.equal(res.status, 204);
      })
      .catch(err => {
        // console.log(`Error: ${err}`);
      });
  });

  it("should receive a 404 status code when database is improperly queried", () => {
    axios
      .put("http://localhost:8080/reviews/helpful/NOT_NUM")
      .then(res => {
        assert.equal(res.status, 404);
      })
      .catch(err => {
        console.log("Error, as intended");
      });
  });
});
