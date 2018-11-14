const insert = {
  click: 'INSERT INTO clicks(target_node, buttons, x, y, timestamp, metadata) VALUES($1, $2, $3, $4, $5, $6)',
  link_click: 'INSERT INTO link_clicks(link_text, target_url, timestamp, metadata) VALUES($1, $2, $3, $4)',
  mouse_move: 'INSERT INTO mouse_moves(x, y, timestamp, metadata) VALUES ($1, $2, $3, $4)',
  key_press: 'INSERT INTO key_presses(key, timestamp, metadata) VALUES ($1, $2, $3)',
  pageview: 'INSERT INTO pageviews(url, title, timestamp, metadata) VALUES ($1, $2, $3, $4)',
  form_submission: 'INSERT INTO form_submissions(data, timestamp, metadata) VALUES ($1, $2, $3)',
}

module.exports = insert;