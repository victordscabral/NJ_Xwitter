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
    
    res.status(200).render("login");
})

router.post("/", async (req, res, next) => {

    var payload = req.body;

    if(req.body.logUsername && req.body.logPassword) {
        var user = await User.findOne({
            $or: [
                { username: req.body.logUsername },
                { email: req.body.logUsername }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Algo deu errado.";
            res.status(200).render("login", payload);
        });
        
        if(user != null) {
            var result = await bcrypt.compare(req.body.logPassword, user.password);

            if(result === true) {
                req.session.user = user;
                return res.redirect("/");
            }
        }

        payload.errorMessage = "Credenciais de login incorretas.";
        return res.status(200).render("login", payload);
    }

    payload.errorMessage = "Garanta que cada campo tenha um valor válido.";
    res.status(200).render("login");
})

module.exports = router;