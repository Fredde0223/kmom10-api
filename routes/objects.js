const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/objects.sqlite');

const jwtSecret = process.env.JWT_SECRET;

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, jwtSecret, function(err) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: req.path,
                        title: "Failed authentication",
                        detail: err.message
                    }
                });
            }

            next();

            return undefined;
        });
    } else {
        return res.status(401).json({
            errors: {
                status: 401,
                source: req.path,
                title: "No token",
                detail: "No token provided in request headers"
            }
        });
    }
}

function getObjects(res, req) {
    db.all("SELECT * FROM objects",
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            res.json( { data: rows } );
        });
}

router.get("/",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => getObjects(res, req));

function updateValues(res, body) {
    const goldVal = body.goldValue;
    const silverVal = body.silverValue;
    const copperVal = body.copperValue;
    const ironVal = body.ironValue;
    const aluminiumVal = body.aluminiumValue;

    if (!goldVal || !silverVal || !copperVal || !ironVal || !aluminiumVal) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/objects",
                title: "Missing values",
                detail: "Missing values in request"
            }
        });
    }

    db.run("UPDATE objects SET goldValue = ?, silverValue = ?, copperValue = ?, ironValue = ?, aluminiumValue = ?",
        goldVal,
        silverVal,
        copperVal,
        ironVal,
        aluminiumVal, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Content successfully updated."
                }
            });
        });
}

router.put("/", (req, res) => updateValues(res, req.body));

function objectBuy(res, body) {
    const gold = body.gold;
    const silver = body.silver;
    const copper = body.copper;
    const iron = body.iron;
    const aluminium = body.aluminium;
    const selected = body.selected;
    const amount = body.amount;
    var newAmount = null;

    if (!selected || !amount) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/objects/buy",
                title: "Missing inputs",
                detail: "Missing inputs in request"
            }
        });
    }

    if (selected == "gold") {
        newAmount = parseInt(gold) - parseInt(amount);
    } else if (selected == "silver") {
        newAmount = parseInt(silver) - parseInt(amount);
    } else if (selected == "copper") {
        newAmount = parseInt(copper) - parseInt(amount);
    } else if (selected == "iron") {
        newAmount = parseInt(iron) - parseInt(amount);
    } else if (selected == "aluminium") {
        newAmount = parseInt(aluminium) - parseInt(amount);
    }

    const sql = "UPDATE objects SET " + selected + " = ?"

    db.run(sql,
        newAmount, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Content successfully updated."
                }
            });
        });
}

router.put("/buy",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => objectBuy(res, req.body));

function objectSell(res, body) {
    const gold = body.gold;
    const silver = body.silver;
    const copper = body.copper;
    const iron = body.iron;
    const aluminium = body.aluminium;
    const selected = body.selected;
    const amount = body.amount;
    var newAmount = null;

    if (!selected || !amount) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/objects/sell",
                title: "Missing inputs",
                detail: "Missing inputs in request"
            }
        });
    }

    if (selected == "gold") {
        newAmount = parseInt(gold) + parseInt(amount);
    } else if (selected == "silver") {
        newAmount = parseInt(silver) + parseInt(amount);
    } else if (selected == "copper") {
        newAmount = parseInt(copper) + parseInt(amount);
    } else if (selected == "iron") {
        newAmount = parseInt(iron) + parseInt(amount);
    } else if (selected == "aluminium") {
        newAmount = parseInt(aluminium) + parseInt(amount);
    }

    const sql = "UPDATE objects SET " + selected + " = ?"

    db.run(sql,
        newAmount, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/sell",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Content successfully updated."
                }
            });
        });
}

router.put("/sell",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => objectSell(res, req.body));

module.exports = router;
