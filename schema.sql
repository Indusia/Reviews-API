DROP TABLE reviews CASCADE;
DROP TABLE photos CASCADE;
DROP TABLE characteristics CASCADE;
DROP TABLE ratings CASCADE;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  rating SMALLINT NOT NULL,
  summary VARCHAR (255) NOT NULL,
  recommend CHAR (1) NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  response VARCHAR (255) DEFAULT NULL,
  body TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  reviewer_name VARCHAR (50) NOT NULL,
  reviewer_email VARCHAR (50) NOT NULL,
  helpfulness INTEGER NOT NULL DEFAULT 0,
  product_id INTEGER NOT NULL
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  review_id INTEGER NOT NULL REFERENCES reviews(id)
);

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  value SMALLINT NOT NULL,
  characteristic_id INTEGER NOT NULL REFERENCES characteristics(id),
  review_id INTEGER NOT NULL REFERENCES reviews(id) 
);

CREATE INDEX review_product ON reviews(product_id);
CREATE INDEX photo_review ON photos(review_id);
CREATE INDEX characteristic_product ON characteristics(product_id);
CREATE INDEX rating_review ON ratings(review_id);
CREATE INDEX rating_characteristic ON ratings(characteristic_id);