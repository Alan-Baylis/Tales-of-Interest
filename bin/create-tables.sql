DROP TABLE IF EXISTS stories;

CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  story TEXT DEFAULT '',
  meta TEXT DEFAULT '',
  raw_story TEXT NOT NULL,
  tsv TSVECTOR
);

CREATE INDEX story_vector_index ON stories USING GIN(tsv) WITH (FASTUPDATE = OFF);