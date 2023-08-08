const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const model = require("../models/user");
const User = model.User;

exports.signup = (req, res) => {
  const { name, email, password, address, number } = req.body;

  User.findOne({ number: number })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that number" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
          address,
          number,
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal server error" });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.login = (req, res) => {
  const { number, password } = req.body;
  if (!number || !password) {
    return res.status(422).json({ error: "please add number or password" });
  }
  User.findOne({ number: number }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid number or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, number, email, address } = savedUser;
          res.json({
            token,
            user: { _id, name, number, email, address },
          });
        } else {
          return res.status(422).json({ error: "Invalid number or password" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};
