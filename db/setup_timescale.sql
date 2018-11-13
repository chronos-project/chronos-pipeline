CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE link_clicks (
  id SERIAL NOT NULL,
  link_text TEXT,
  target_url TEXT NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT NOW(),
  client_time TIMESTAMP NOT NULL,
  metadata JSONB NOT NULL);

CREATE TABLE clicks (
  id SERIAL NOT NULL,
  target_node TEXT NOT NULL,
  buttons INT NOT NULL,
  x INT NOT NULL,
  y INT NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT NOW(),
  client_time TIMESTAMP NOT NULL,
  metadata JSONB NOT NULL);

CREATE TABLE pageviews (
  id SERIAL NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT NOW(),
  client_time TIMESTAMP NOT NULL,
  metadata JSONB NOT NULL);
);

CREATE TABLE mouse_moves (
  id SERIAL NOT NULL,
  x INT NOT NULL,
  y INT NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT NOW(),
  client_time TIMESTAMP NOT NULL,
  metadata JSONB NOT NULL);
);

CREATE TABLE key_presses (
  id SERIAL NOT NULL,
  key VARCHAR(1) NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT NOW(),
  client_time TIMESTAMP NOT NULL,
  metadata JSONB NOT NULL);
);

CREATE TABLE form_submissions (
  id SERIAL NOT NULL,
  data JSONB NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT NOW(),
  client_time TIMESTAMP NOT NULL,
  metadata JSONB NOT NULL);
);

SELECT create_hypertable('link_clicks', 'time');
SELECT create_hypertable('clicks', 'time');
SELECT create_hypertable('pageviews', 'time');
SELECT create_hypertable('mouse_moves', 'time');
SELECT create_hypertable('form_submissions', 'time');
SELECT create_hypertable('key_presses', 'time');
