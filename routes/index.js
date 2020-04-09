const users = require("./users");
const restaurants = require("./restaurants");
const reviews = require("./reviews");
const comments = require("./comments");

const constructorMethod = app => {
  app.use("/users", users);
  app.use("/restaurants", restaurants);
  app.use("/reviews", reviews);
  app.use("/comments", comments);
  
  app.get("/", (req, res) => {
    res.status(200).render("index");
  });

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });  
  }); 
};

module.exports = constructorMethod;