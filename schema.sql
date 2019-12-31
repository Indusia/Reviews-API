DROP TABLE reviews CASCADE;
DROP TABLE photos CASCADE;
DROP TABLE characteristics CASCADE;
DROP TABLE ratings CASCADE;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  rating SMALLINT NOT NULL,
  summary VARCHAR (255) NOT NULL,
  recommend BOOLEAN,
  response VARCHAR (255),
  body VARCHAR (255) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  reviewer_name VARCHAR (50),
  helpfulness INTEGER,
  product_id INTEGER NOT NULL
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(255),
  review_id INTEGER REFERENCES reviews(id)
);

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  value SMALLINT,
  characteristics_id INTEGER REFERENCES characteristics(id)
);