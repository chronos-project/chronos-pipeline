const constructEvent = (event) => {
  const obj = {};

  obj.eType = event[0];

  switch (obj.eType) {
    case 'link_clicks':
      obj.linkText = event[1];
      obj.targetURL = event[2];
      obj.timestamp = event[3];
      break;
    case 'clicks':
      obj.target_node = event[1];
      obj.buttons = event[2];
      obj.x = event[3];
      obj.y = event[4];
      obj.timestamp = event[5];
      break;
    case 'mouse_moves':
      obj.x = event[1];
      obj.y = event[2];
      obj.timestamp = event[3];
      break;
    case 'key_presses':
      obj.key = event[1];
      obj.timestamp = event[2];
      break;
    case 'form_submissions':
      obj.data = event[1];
      obj.timestamp = event[2];
      break;
    case 'pageviews':
      obj.url = event[1];
      obj.title = event[2];
      obj.timestamp = event[3];
      break;
  }

  return obj;
};

module.exports = constructEvent;
