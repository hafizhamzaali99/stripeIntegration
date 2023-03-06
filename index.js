const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

const PUBLISHED_KEY = process.env.PUBLISHED_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

const stripe = require("stripe")(SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("Home", {
    key: PUBLISHED_KEY,
  });
});

app.post("/payment", function (req, res) {
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Hafiz Hamza ",
      address: {
        line1: "house#74 st#5",
        postal_code: "75800",
        city: "Karachi",
        state: "Karachi",
        country: "Pakistan",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 50000, // Charing Rs 25
        description: "Laptop Product",
        currency: "USD",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("Success"); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
