var axios = require('axios');
var data = JSON.stringify({
  collection: 'orders',
  database: 'TenbytenAdmin',
  dataSource: 'Cluster0',
  projection: {
    _id: 1,
  },
});

var config = {
  method: 'post',
  url: 'https://data.mongodb-api.com/app/data-ljrof/endpoint/data/v1/action/findOne',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key':
      'FVIlfuHQGkKCWMAg6gqazvgBUeLVyLGxKDo0TDbIbLrXaROovtQkZK5HrzwRGM2r',
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
