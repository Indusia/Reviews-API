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

module.exports.countRAndR = data => {
  const counts = {
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    recommended: {
      0: 0,
      1: 0
    }
  };
  for (const row of data) {
    counts.ratings[row.rating] = counts.ratings[row.rating] + 1;
    counts.recommended[row.recommend] = counts.recommended[row.recommend] + 1;
  }

  for (const rating in counts.ratings) {
    if (!counts.ratings[rating]) {
      delete counts.ratings[rating];
    }
  }

  for (const recommended in counts.recommended) {
    if (!counts.recommended[recommended]) {
      delete counts.recommended[recommended];
    }
  }

  return counts;
};

module.exports.parseCharacteristics = data => {
  const cObj = {};

  for (const characteristic of data) {
    cObj[characteristic.name] = {
      id: characteristic.characteristic_id,
      value: characteristic.average
    };
  }

  return cObj;
};
