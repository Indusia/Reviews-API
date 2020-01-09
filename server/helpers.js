module.exports.dataSort = (data, sortBy) => {
  if (sortBy === "newest") {
    data.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      }
      if (a.date < b.date) {
        return 1;
      }
      return 0;
    });
  } else if (sortBy === "helpful") {
    data.sort((a, b) => {
      return b.helpfulness - a.helpfulness;
    });
  } else {
    data.sort((a, b) => {
      if (a.helpfulness > b.helpfulness) {
        return -1;
      } else if (a.helpfulness < b.helpfulness) {
        return 1;
      } else {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.date) {
          return 1;
        }
      }
    });
  }
};
