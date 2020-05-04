const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
const uData = require("./data/userData");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const data = require("./users");

app.use(cookieParser());
app.use(cors());
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string',
        resave: false,
        saveUninitialized: true
    })
);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var auth = "Not Authenticated"

app.use(function(request, response, next) {
  console.log('Timestamp ' + new Date().toUTCString());
  console.log('Request Method: ' + request.method);
  console.log('Request Routes: ' + request.originalUrl);
  next();
  if(request.session) {
    if(!request.session.AuthCookie) {
      console.log("User is not Authenticated yet!")
    }
    else {
      console.log("User is Authenticated!");
    } 
  } else {
    if(request.originalUrl == '/logout')
      console.log('User has been logged out!');
    else
      console.log("User is not Authenticated yet!")
  }
  console.log("---------------------------------------------------")
});

app.use("/profile", function(req, res, next){
    if(!req.session.AuthCookie) {
      let hasErrors = true;
      let errors = [];
      errors.push("Not Logged In, Please Login");
      res.status(403).render("layouts/main", {hasErrors:hasErrors, errors: errors});
    } else {
      next();
    }
  });

  app.post("/login", async (req, res) => {
    let hasErrors = false;
    let errors = [];
    let userId = req.session.AuthCookie;
    if(userId) {
      auth = "Authorised User"
      res.redirect("users/profile");
    } else {
      let userName = req.body.username;
      let password = req.body.password;
      user = data.users.find(element=>element.username === userName)
      if(!user) {
          auth = "Not Authorised User"
          hasErrors = true;
          errors.push("Invalid Username or Password");
          res.status(401);
          res.render("layouts/main", {hasErrors:hasErrors, errors: errors});
      } else {
          let isSame = await bcrypt.compare(password, user.hashedPassword);
          if(!isSame) {
             auth = "Not Authorised User"
             hasErrors = true;
             errors.push("Invalid Username/Password");
             res.status(401);
             res.render("layouts/main", {hasErrors:hasErrors, errors: errors});
          } else {
            auth = "Authorised User"
            let userId = await uData.getUserId(userName);
            req.session.AuthCookie = userId;
            res.redirect("users/profile");
          }
      }
    }
  });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Routes will be running on http://localhost:3000")
  if (process && process.send) {
    process.send({done: true});
  }
});