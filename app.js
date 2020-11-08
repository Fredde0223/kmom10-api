const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 8334;

app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const index = require('./routes/index');
const login = require('./routes/login');
const register = require('./routes/register');
const accounts = require('./routes/accounts');
const objects = require('./routes/objects');

app.use('/register', register);
app.use('/login', login);
app.use('/', index);
app.use('/accounts', accounts);
app.use('/objects', objects);

app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

const server = app.listen(port, () => console.log(`This API is listening on port ${port}!`));

module.exports = server;
