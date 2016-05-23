DROP TABLE IF EXISTS stories;

CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  story TEXT DEFAULT '',
  tsv TSVECTOR
);

CREATE INDEX story_tsv ON stories USING GIN(tsv);

CREATE TRIGGER story_tsv_trigger BEFORE INSERT OR UPDATE ON stories FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(tsv, 'pg_catalog.english', story);