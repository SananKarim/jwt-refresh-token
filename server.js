const express = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
app.use(express.json());

const posts = [
  { username: "jim", title: "Post 1" },
  {
    username: "sam",
    title: "Post 2",
  },
];

app.get("/post", authenticateToken, (req, res) => {
  console.log("I am here");
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  console.log("req", req);
  const username = req.body.username;
  console.log(req.body.username);
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

function authenticateToken(req, res, next) {
  console.log("req", req);
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (token == null) return res.sendStatus(401); // They don't have access. They haven't sent a token.

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // You have a token which is no longer valid.

    req.user = user;
    next();
  });
}

app.listen(3000);
