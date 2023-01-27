const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const router = express.Router();
const Users = require('../Models/usersModel');

router.use(express.json());
router.use(express.urlencoded());


router.get('/', (req, res) => {
    Users.find({}, (err, result) => {
        if (err) throw err;
        else {
            res.send(result);
        }
    });
});


// router.get("/:id", async(req, res) => {
//     const user = await Users.findById(req.params.id);

//     if (!user) {
//         res
//             .status(500)
//             .json({ massage: "the category with the give ID was not found" })
//     }
//     res.status(200).send(user);
// });

router.post('/', (req, res) => {
    Users.insertMany(req.body, (err, result) => {
        if (err) throw err;
        else {
            res.json({ "msg": "insert Success...!" });
        }
    });

});



router.post("/login", async(req, res) => {
    const user = await Users.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send("The user not found");
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret, { expiresIn: "1d" }
        );
        res.status(200).send({ user: user.email, token: token });
    } else {
        res.status(400).send("password is wrong!");
    }
});



router.put('/', (req, res) => {
    User.updateOne(req.body.select, { $set: req.body.update }, (err, result) => {
        if (err) throw err;
        else {
            res.send(result);
        };
    });

});

router.delete('/', (req, res) => {
    User.deleteOne(req.body, (err, result) => {
        if (err) throw err;
        else {
            res.send(result);
        };
    });
});

module.exports = router;