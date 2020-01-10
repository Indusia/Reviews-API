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

module.exports.isDataValid = data => {
  if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
    return false;
  }

  if (typeof data.summary !== "string" || data.summary.length < 1) {
    return false;
  }

  if (typeof data.body !== "string" || data.body.length < 1) {
    return false;
  }

  if (typeof data.recommend !== "boolean") {
    return false;
  }

  if (typeof data.name !== "string" || data.name.length < 1) {
    return false;
  }

  if (typeof data.email !== "string" || data.email.length < 1) {
    return false;
  }

  for (const photo of data.photos) {
    if (typeof photo !== "string" || photo.length < 1) {
      return false;
    }
  }

  for (const charID in data.characteristics) {
    if (data.characteristics[charID] > 5 || data.characteristics[charID] < 1) {
      return false;
    }
  }

  console.log("Valid Input");
  return true;
};
