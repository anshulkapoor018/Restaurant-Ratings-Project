const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const cors = require('cors');
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');

app.use(cors());
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("server is started");
    console.log("Routes will be running on http://localhost:3000");
});