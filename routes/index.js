var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    const data = {
        data: [
            {
                route: "/accounts",
                about: "account information for users"
            },
            {
                route: "/objects",
                about: " information about trading-objects"
            }
        ]
    };

    res.json(data);
});

module.exports = router;
