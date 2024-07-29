const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {

    res.status(200).render("register");
})

router.post("/", async (req, res, next) => {

    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;

    if(firstName && lastName && username && email && password) {
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Algo deu errado.";
            res.status(200).render("register", payload);
        });

        if(user == null) {
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);

            User.create(data)
            .then((user) => {
                req.session.user = user;
                return res.redirect("/");
            })
        }
        else {
            if (email == user.email) {
                payload.errorMessage = "Email já está sendo usado.";
            }
            else {
                payload.errorMessage = "Nome de usuário já sendo usado.";
            }
            res.status(200).render("register", payload);
        }
    }
    else {
        payload.errorMessage = "Certifique-se de que cada campo tenha um valor válido.";
        res.status(200).render("register", payload);
    }
})

module.exports = router;