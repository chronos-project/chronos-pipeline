const insert = {
  click: 'INSERT INTO clicks(target_node, buttons, x, y, client_time, metadata) VALUES ($1, $2, $3, $4, to_timestamp($5), $6) RETURNING *',
  link_click: 'INSERT INTO link_clicks(link_text, target_url, client_time, metadata) VALUES ($1, $2, to_timestamp($3), $4) RETURNING *',
  mouse_move: 'INSERT INTO mouse_moves(x, y, client_time, metadata) VALUES ($1, $2, to_timestamp($3), $4) RETURNING *',
  key_press: 'INSERT INTO key_presses(key, client_time, metadata) VALUES ($1, to_timestamp($2), $3) RETURNING *',
  pageview: 'INSERT INTO pageviews(url, title, client_time, metadata) VALUES ($1, $2, to_timestamp($3), $4) RETURNING *',
  form_submission: 'INSERT INTO form_submissions(data, client_time, metadata) VALUES ($1, to_timestamp($2), $3) RETURNING *',
};

module.exports = insert;
