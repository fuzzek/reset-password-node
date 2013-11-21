var express = require('express');
var	app = express();

require('./config/config_app')(app);
require('./config/config_routes')(app);

app.listen(3000);
console.log('Started the server at port 3000');