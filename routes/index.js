const comments = require("./comments");
const restaurants = require("./restaurants");
const reviews = require("./reviews");
const users = require("./users");

const constructorMethod = app => {
  app.use("/comments", comments);
  app.use("/restaurants", restaurants);
  app.use("/reviews", reviews);
  app.use("/users", users);
  
  app.get("/", (req, res) => {
    res.status(200).render("index");
  });

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });  
  }); 
};

module.exports = constructorMethod;