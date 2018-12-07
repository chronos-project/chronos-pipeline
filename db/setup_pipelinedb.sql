CREATE EXTENSION IF NOT EXISTS pipelinedb;

/*  STREAMS
    Note: constraints are currently unsupported on streams  */

CREATE FOREIGN TABLE clicks(
  target_node TEXT,
  buttons INT,
  x INT,
  y INT,
  time TIMESTAMPTZ DEFAULT NOW(),
  client_time TIMESTAMPTZ,
  metadata JSONB
)
SERVER pipelinedb;

CREATE FOREIGN TABLE link_clicks(
  link_text TEXT,
  target_url TEXT,
  time TIMESTAMPTZ DEFAULT NOW(),
  client_time TIMESTAMPTZ,
  metadata JSONB
)
SERVER pipelinedb;

CREATE FOREIGN TABLE mouse_moves(
  x INT,
  y INT,
  time TIMESTAMPTZ DEFAULT NOW(),
  client_time TIMESTAMPTZ,
  metadata JSONB
)
SERVER pipelinedb;

  CREATE FOREIGN TABLE key_presses(
  key VARCHAR(1),
  time TIMESTAMPTZ DEFAULT NOW(),
  client_time TIMESTAMPTZ,
  metadata JSONB
)
SERVER pipelinedb;

CREATE FOREIGN TABLE pageviews(
  url TEXT,
  title TEXT,
  time TIMESTAMPTZ DEFAULT NOW(),
  client_time TIMESTAMPTZ,
  metadata JSONB
)
SERVER pipelinedb;

CREATE FOREIGN TABLE form_submissions(
  data JSONB,
  time TIMESTAMPTZ DEFAULT NOW(),
  client_time TIMESTAMPTZ,
  metadata JSONB
)
SERVER pipelinedb;

/*   VIEWS  */

CREATE VIEW node_types_count AS
SELECT
 target_node,
 count(*) AS count
FROM clicks
GROUP BY target_node;

CREATE VIEW link_text_counts AS
SELECT
  link_text,
  count(*)
FROM link_clicks
GROUP BY link_text;

CREATE VIEW key_press_count AS
SELECT
  key,
  count(*)
FROM key_presses
GROUP BY key;

CREATE VIEW mouse_moves_count AS
SELECT
  x,
  count(*) AS count
FROM mouse_moves
GROUP BY x;

CREATE VIEW title_views_count AS
SELECT
  title,
  count(*)
FROM pageviews
GROUP BY title;
