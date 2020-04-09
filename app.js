const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const cors = require('cors');
const configRoutes = require('./routes');

app.use(cors());
app.use(express.json());

app.engine('handlebars', exphbs({ defaultLayout: 'index'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("server is started");
    console.log("Routes will be running on http://localhost:3000");
});