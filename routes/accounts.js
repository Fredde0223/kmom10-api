const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/accounts.sqlite');

const jwtSecret = process.env.JWT_SECRET;

function createAcc(res, body) {
    const email = body.email;

    if (!email) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/accounts",
                title: "Email missing",
                detail: "Email missing in request"
            }
        });
    }

    db.run("INSERT INTO accounts (email) VALUES (?)",
        email,
        (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/accounts",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Account successfully created."
                }
            });
        });
}

router.post("/", (req, res) => createAcc(res, req.body));

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

function getAccounts(res, req) {
    const email = req.headers['email'];

    db.all("SELECT * FROM accounts WHERE email LIKE (?)",
        email,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/accounts",
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
    (req, res) => getAccounts(res, req));

function addBalance(res, body) {
    const email = body.email;
    const preBalance = parseInt(body.balance);
    const addedBalance = parseInt(body.addedBalance);
    const newBalance = preBalance + addedBalance;

    if (!email || !addedBalance) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/accounts",
                title: "Something missing",
                detail: "Something missing in request"
            }
        });
    }

    db.run("UPDATE accounts SET balance = ? WHERE email = ?",
        newBalance,
        email, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/accounts",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Balance successfully updated."
                }
            });
        });
}

router.put("/",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => addBalance(res, req.body));

function accountBuy(res, body) {
    const email = body.email;
    const balance = body.balance;
    const gold = body.accGold;
    const silver = body.accSilver;
    const copper = body.accCopper;
    const iron = body.accIron;
    const aluminium = body.accAluminium;
    const goldValue = body.goldValue;
    const silverValue = body.silverValue;
    const copperValue = body.copperValue;
    const ironValue = body.ironValue;
    const aluminiumValue = body.aluminiumValue;
    const selected = body.selected;
    const amount = body.amount;
    var price = null;
    var newAmount = null;
    var newBalance = null;

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
        newAmount = parseInt(gold) + parseInt(amount);
        price = parseInt(goldValue) * parseInt(amount);
        newBalance = parseInt(balance) - parseInt(price);
    } else if (selected == "silver") {
        newAmount = parseInt(silver) + parseInt(amount);
        price = parseInt(silverValue) * parseInt(amount);
        newBalance = parseInt(balance) - parseInt(price);
    } else if (selected == "copper") {
        newAmount = parseInt(copper) + parseInt(amount);
        price = parseInt(copperValue) * parseInt(amount);
        newBalance = parseInt(balance) - parseInt(price);
    } else if (selected == "iron") {
        newAmount = parseInt(iron) + parseInt(amount);
        price = parseInt(ironValue) * parseInt(amount);
        newBalance = parseInt(balance) - parseInt(price);
    } else if (selected == "aluminium") {
        newAmount = parseInt(aluminium) + parseInt(amount);
        price = parseInt(aluminiumValue) * parseInt(amount);
        newBalance = parseInt(balance) - parseInt(price);
    }

    sql = "UPDATE accounts SET " + selected + " = ?, balance = ? WHERE email = ?"

    db.run(sql,
        newAmount,
        newBalance,
        email, (err) => {
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
    (req, res) => accountBuy(res, req.body));

function accountSell(res, body) {
    const email = body.email;
    const balance = body.balance;
    const gold = body.accGold;
    const silver = body.accSilver;
    const copper = body.accCopper;
    const iron = body.accIron;
    const aluminium = body.accAluminium;
    const goldValue = body.goldValue;
    const silverValue = body.silverValue;
    const copperValue = body.copperValue;
    const ironValue = body.ironValue;
    const aluminiumValue = body.aluminiumValue;
    const selected = body.selected;
    const amount = body.amount;
    var price = null;
    var newAmount = null;
    var newBalance = null;

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
        newAmount = parseInt(gold) - parseInt(amount);
        price = parseInt(goldValue) * parseInt(amount);
        newBalance = parseInt(balance) + parseInt(price);
    } else if (selected == "silver") {
        newAmount = parseInt(silver) - parseInt(amount);
        price = parseInt(silverValue) * parseInt(amount);
        newBalance = parseInt(balance) + parseInt(price);
    } else if (selected == "copper") {
        newAmount = parseInt(copper) - parseInt(amount);
        price = parseInt(copperValue) * parseInt(amount);
        newBalance = parseInt(balance) + parseInt(price);
    } else if (selected == "iron") {
        newAmount = parseInt(iron) - parseInt(amount);
        price = parseInt(ironValue) * parseInt(amount);
        newBalance = parseInt(balance) + parseInt(price);
    } else if (selected == "aluminium") {
        newAmount = parseInt(aluminium) - parseInt(amount);
        price = parseInt(aluminiumValue) * parseInt(amount);
        newBalance = parseInt(balance) + parseInt(price);
    }

    sql = "UPDATE accounts SET " + selected + " = ?, balance = ? WHERE email = ?"

    db.run(sql,
        newAmount,
        newBalance,
        email, (err) => {
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
    (req, res) => accountSell(res, req.body));

module.exports = router;
